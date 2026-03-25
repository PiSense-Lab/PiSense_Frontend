import React, { useState } from "react";
import Spreadsheet from "../components/Spreadsheet";
import { RxTrash, RxDownload } from "react-icons/rx";

const Data = () => {
  const [selectedDataset, setSelectedDataset] = useState(null);

  // Clean mock data with all five columns
  const [datasets, setDatasets] = useState([
    {
      id: 1,
      name: "Weather Station A",
      type: "Weather",
      rows: 1520,
      lastModified: "2026-03-08",
    },
    {
      id: 2,
      name: "Battery Pack 04 Test",
      type: "Battery",
      rows: 845,
      lastModified: "2026-03-09",
    },
    {
      id: 4,
      name: "Solar Grid Analysis",
      type: "Energy",
      rows: 2100,
      lastModified: "2026-03-01",
    },
  ]);

  const handleViewDataset = (dataset) => {
    setSelectedDataset(dataset);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Datasets
        </h1>
        <p className="text-slate-500 text-sm">
          Review and manage your submitted data tables.
        </p>
      </div>

      {/* 5-Column Inventory Table */}
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
            {datasets.map((ds) => (
              <tr
                key={ds.id}
                className="hover:bg-slate-50/50 dark:hover:bg-white/5 group"
              >
                {/* 1. Dataset Name */}
                <td className="p-4 font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {ds.name}
                </td>

                {/* 2. Type */}
                <td className="p-4">
                  <span className="text-[11px] font-bold px-2 py-1 bg-sky/10 text-sky rounded uppercase border border-sky/20">
                    {ds.type}
                  </span>
                </td>

                {/* 3. Rows */}
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm text-center font-mono">
                  {ds.rows.toLocaleString()}
                </td>

                {/* 4. Modified Date */}
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                  {ds.lastModified}
                </td>

                {/* 5. Actions */}
                <td className="p-4">
                  <div className="flex justify-end items-center gap-4">
                    <button
                      onClick={() => handleViewDataset(ds)}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Modal */}
      {selectedDataset && (
        <Spreadsheet
          open={!!selectedDataset}
          onClose={() => setSelectedDataset(null)}
        />
      )}
    </div>
  );
};

export default Data;
