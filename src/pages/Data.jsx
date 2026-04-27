import React, { useState, useEffect } from "react";
import Spreadsheet from "../components/Spreadsheet";
import { RxTrash, RxDownload } from "react-icons/rx";
import RoundButton from "../components/RoundButton";
import { getTable, getTables, getDatasetsForProject } from "../api/timeseries";

const Data = () => {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasetsMeta, setDatasetsMeta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const projectid = JSON.parse(localStorage.getItem("projectid"));
        if (projectid === "weather-1") {
          const cachedRaw = localStorage.getItem("weatherDailyCache");
          const cachedData = cachedRaw ? JSON.parse(cachedRaw) : null;
          const datasets = Array.isArray(cachedData?.data) ? cachedData.data : [];

          if (datasets.length > 0) {
            setDatasetsMeta(datasets);
            setLoading(false);
            return;
          }

          const projectDatasets = await getDatasetsForProject(projectid);
          setDatasetsMeta(projectDatasets);
          setLoading(false);
          return;
        }
        const data = await getDatasetsForProject(projectid);
        if (data) {
          console.log("Fetched datasets metadata:", data);

          const normalized = data.map((tableName) => ({
            id: tableName,
            name: tableName,
            type: "table", // or infer if needed
            rows: 0,
            lastModified: null,
          }));

          setDatasetsMeta(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  // get data from the backend api from projectid and put the basic table data in the datasetsmeta


  const handleViewDataset = async (dataset) => {
    console.log("Viewing dataset:", dataset);
    if (dataset.mode === "edit") {
      if (dataset.data) {
        setSelectedDataset({ ...dataset, mode: "edit" });
        return;
      }

      const projectid = JSON.parse(localStorage.getItem("projectid"));
      console.log("Fetching dataset for project ID:", projectid, "dataset:", dataset);
      const result = await getTable(dataset.name, projectid);
      console.log("Fetched dataset for viewing/editing:", result);

      if (!result) {
        console.error("Failed to load dataset");
        return;
      }

      setSelectedDataset({ ...dataset, data: result });
    } else {
      setSelectedDataset(dataset);
    }
  };
  console.log("Selected dataset:", selectedDataset);

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Datasets
          </h1>
          <p className="text-slate-500 text-sm">
            Review and manage your submitted data tables.
          </p>
        </div>
        <RoundButton
          onClick={() =>
            handleViewDataset({
              mode: "create",
              id: null,
            })
          }
          className="bg-sky text-white w-25 h-10"
        >
          New
        </RoundButton>
      </div>

      {/* Dataset Table */}
      {loading ? (
        <div className="bg-white dark:bg-midnight rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
          Loading datasets...
        </div>
      ) : (
        <div className="bg-white dark:bg-midnight rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-pitch border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">
                  Dataset Name
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">
                  Type
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">
                  Rows
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">
                  Modified Date
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {datasetsMeta.map((ds) => {
                const rowCount = ds.rows || (Array.isArray(ds.data) ? ds.data.length : 0);
                const modifiedDate = ds.lastModified || ds.date || new Date().toISOString().split("T")[0];

                return (
                  <tr
                    key={ds.id}
                    className="hover:bg-slate-100/50 dark:hover:bg-white/5 group"
                  >
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {ds.name || ds}
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-bold px-2 py-1 bg-sky/10 text-sky rounded uppercase border border-sky/20">
                        {ds.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm text-center font-mono">
                      {rowCount.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                      {modifiedDate}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end items-center gap-4">
                        <button
                          onClick={() =>
                            handleViewDataset({ ...ds, mode: "edit" })
                          }
                          className="px-6 py-1.5 bg-sky text-white text-sm font-bold rounded-lg hover:bg-sky/90 shadow-sm shadow-sky/10"
                        >
                          View
                        </button>

                        <div className="flex gap-2 opacity-40 group-hover:opacity-100 ">
                          <button className="text-slate-400 hover:text-sky p-1">
                            <RxDownload size={18} />
                          </button>
                          <button className="text-slate-400 hover:text-red-500 p-1">
                            <RxTrash size={18} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Spreadsheet Modal */}
      {selectedDataset && (
        <Spreadsheet
          open={!!selectedDataset}
          onClose={() => setSelectedDataset(null)}
          mode={selectedDataset.mode || "create"} // default to create
          existingDatasetName={selectedDataset} // used by the API in edit mode
          initialData={Array.isArray(selectedDataset.data) ? selectedDataset.data : []}
        />
      )}
    </div>
  );
};

export default Data;
