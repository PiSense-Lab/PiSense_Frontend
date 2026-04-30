import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Spreadsheet from "../components/Spreadsheet";
import { RxTrash, RxDownload } from "react-icons/rx";
import RoundButton from "../components/RoundButton";
import { getTable, getDatasetsForProject } from "../api/timeseries";

const Data = () => {
  const { activeProject } = useOutletContext();
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasetsMeta, setDatasetsMeta] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch datasets when project changes
  useEffect(() => {
    const fetchDatasets = async () => {
      if (!activeProject) return;
      
      setLoading(true);
      try {
        const projectid = activeProject.id;
        localStorage.setItem("projectid", JSON.stringify(projectid));
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

          setDatasetsMeta(data);
        }
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [activeProject]);

  // get data from the backend api from projectid and put the basic table data in the datasetsmeta


  const handleViewDataset = async (dataset) => {
    if (dataset.mode === "edit") {
      if (dataset.data) {
        setSelectedDataset({ ...dataset, data: dataset.data });
        return;
      }

      const projectid = activeProject?.id;
      const result = await getTable(dataset.table_name, projectid);

      if (!result) {
        console.error("Failed to load dataset");
        return;
      }
      console.log("Fetched dataset data:", result);
      setSelectedDataset({ ...dataset, data: result });
    } else {
      console.log("Creating new dataset");
      setSelectedDataset(dataset);
    }
  };

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
                  Rows
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">
                  Columns
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
                const rowCount = ds.row_count || (Array.isArray(ds.data) ? ds.data.length : 0);
                const modifiedDate = ds.last_updated || ds.date || new Date().toISOString().split("T")[0];

                return (
                  <tr
                    key={ds.id ?? ds.table_name ?? ds}
                    className="hover:bg-slate-100/50 dark:hover:bg-white/5 group"
                  >
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {ds.table_name || "Untitled Dataset"}
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-bold px-2 py-1 bg-sky/10 text-sky rounded uppercase border border-sky/20">
                        {rowCount}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm text-center font-mono">
                      {ds.column_count}
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
          open={!!selectedDataset.table_name}
          onClose={() => setSelectedDataset(null)}
          mode={selectedDataset.mode || "create"}
          existingDatasetId={selectedDataset.id}
          initialData={selectedDataset.data}
        />
      )}
    </div>
  );
};

export default Data;
