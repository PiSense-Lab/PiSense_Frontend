import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Graph from "../components/dashboard/Graph";
import QuickActions from "../components/dashboard/QuickActions";
import AIInsight from "../components/dashboard/AIInsight";
import SystemMonitor from "../components/dashboard/SystemMonitor";
import SelectedProject from "../components/SelectedProject";
import { uploadData, getTable } from "../api/timeseries";

const Home = () => {
  const { activeProject } = useOutletContext();

  const [manualData, setManualData] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);

  const handleManualSubmit = async () => {
    setLoading(true);
    console.log("Manual submit initiated...");
    setTimeout(() => {
      setLoading(false);
      alert("Manual data processed!");
    }, 1000);
  };

  const handleFileUpload = async () => {
    console.log("Success signal received from FileImport!");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards for the active project */}
      <SelectedProject selectedProject={activeProject} />

      {/* Graph + QuickActions */}
      <div className="grid md:flex gap-4">
        <div className="flex-2 min-w-0">
          <Graph
            data={processedData}
            projectId={activeProject?.project_id}
            dataset={selectedDataset}
          />
        </div>
        <div className="flex-1 min-w-0">
          <QuickActions
            onUpload={handleFileUpload}
            onManualSubmit={handleManualSubmit}
            setUploadFiles={setUploadFiles}
            onDatasetChange={setSelectedDataset}
            selectedProject={activeProject}
          />
        </div>
      </div>

      {/* AIInsight + SystemMonitor */}
      {/* <div className="grid md:grid-cols-2 gap-4">
        <AIInsight projectId={activeProject?.project_id} />
        <SystemMonitor projectId={activeProject?.project_id} />
      </div> */}
    </div>
  );
};

export default Home;