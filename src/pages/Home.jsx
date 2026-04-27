import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Graph from "../components/dashboard/Graph";
import QuickActions from "../components/dashboard/QuickActions";
import SelectedProject from "../components/SelectedProject";

const Home = () => {
  const { activeProject } = useOutletContext();

  const [selectedDataset, setSelectedDataset] = useState(null);

  // Use project ID as key to force re-render when project changes
  const projectKey = activeProject?.id;

  const handleFileUpload = async () => {
    console.log("Success signal received from FileImport!");
  };

  const handleManualSubmit = async () => {
    console.log("Manual submit initiated...");
    alert("Manual data processed!");
  };

  const setUploadFiles = () => {}; // Placeholder - can be expanded later

  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards for the active project */}
      <SelectedProject selectedProject={activeProject} />

      {/* Graph + QuickActions */}
      <div className="grid md:flex gap-4">
        <div className="flex-2 min-w-0">
          <Graph
            key={projectKey}
            projectId={activeProject?.id}
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
        <AIInsight projectId={activeProject?.id} />
        <SystemMonitor projectId={activeProject?.id} />
      </div> */}
    </div>
  );
};

export default Home;