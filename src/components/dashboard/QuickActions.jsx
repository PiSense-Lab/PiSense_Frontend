import React, { useState, useEffect } from "react";
import SelectedDataset from "../SelectedDataset";
import UploadButton from "../UploadButton";
import { getDatasetsForProject } from "../../api/timeseries.js";

const QuickActions = ({
  onUpload,
  onManualSubmit,
  setUploadFiles,
  onDatasetChange,
  selectedProject,
}) => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetName, setSelectedDatasetName] = useState(null);

  const handleDatasetChange = (dataset) => {
    setSelectedDatasetName(dataset.table_name);
    onDatasetChange(dataset);

    if (selectedProject?.id && dataset.table_name) {
      localStorage.setItem(
        `dashboard:selectedDataset`,
        dataset.table_name,
      );
    }
  };

  // Fetch datasets whenever selectedProject changes
  useEffect(() => {
    const fetchDatasets = async () => {
      if (selectedProject?.id) {
        try {
          const ds = await getDatasetsForProject(selectedProject.id);
          setDatasets(ds);
          if (ds.length > 0) {
            // const storageKey = getDatasetStorageKey(selectedProject.id);
            const storageKey = `dashboard:selectedDataset`;
            const savedDatasetName = localStorage.getItem(storageKey);
            const matchedDataset = ds.find(
              (dataset) => dataset.table_name === savedDatasetName,
            );
            const initialDatasetName = matchedDataset ?? ds[0];

            setSelectedDatasetName(initialDatasetName);
            onDatasetChange(initialDatasetName);
          }
        } catch (err) {
          console.error("Error fetching datasets:", err);
          setDatasets([]);
          setSelectedDatasetName(null);
          onDatasetChange(null);
        }
      } else {
        setDatasets([]);
        setSelectedDatasetName(null);
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
        <SelectedDataset
          datasets={datasets}
          selectedName={selectedDatasetName}
          onChange={handleDatasetChange}
        />
      ) : (
        <div>No datasets available for this project</div>
      )}
    </div>
  );
};

export default QuickActions;
