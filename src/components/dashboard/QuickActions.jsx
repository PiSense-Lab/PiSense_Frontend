import React, { useState, useEffect } from "react";
import SelectedDataset from "../SelectedDataset";
import UploadButton from "../UploadButton";
import { getDatasetsForProject } from "../../api/timeseries.js";

const QuickActions = ({ onUpload, onManualSubmit, setUploadFiles, onDatasetChange, selectedProject }) => {
  const [datasets, setDatasets] = useState([]);

  // Fetch datasets whenever selectedProject changes
  useEffect(() => {
    const fetchDatasets = async () => {
      if (selectedProject?.project_id) {
        try {
          const ds = await getDatasetsForProject(selectedProject.project_id);
          setDatasets(ds);
          if (ds.length > 0) {
            onDatasetChange(ds[0].name); // send first dataset upward by default
          }
        } catch (err) {
          console.error("Error fetching datasets:", err);
          setDatasets([]);
        }
      } else {
        setDatasets([]);
        onDatasetChange(null);
      }
    };

    fetchDatasets();
  }, [selectedProject, onDatasetChange]);

  return (
    <div className="flex flex-col gap-2 rounded-md px-8 py-4 bg-white dark:bg-midnight">
      <h1 className="text-lg font-semibold"> Quick Actions: </h1>
      <div className="flex flex-col gap-2 items-center">
        <UploadButton
          onUpload={onUpload}
          onManualSubmit={onManualSubmit}
          setUploadFiles={setUploadFiles}
          className="w-full"
        >
          Upload File
        </UploadButton>
      </div>

      {datasets.length > 0 ? (
        <SelectedDataset datasets={datasets} onChange={onDatasetChange} />
      ) : (
        <div>No datasets available for this project</div>
      )}
    </div>
  );
};

export default QuickActions;