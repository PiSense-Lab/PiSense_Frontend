import React, { useState } from "react";
import SmallContainer from "../components/dashboard/SmallContainer";
import Graph from "../components/dashboard/Graph";
import QuickActions from "../components/dashboard/QuickActions";
import AIInsight from "../components/dashboard/AIInsight";
import SystemMonitor from "../components/dashboard/SystemMonitor";
import { uploadData, getProcessedData } from "../api/timeseries";

const Home = () => {
  const [manualData, setManualData] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]); // Array to hold multiple files
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleManualSubmit = async () => {
    setLoading(true);
    // Simulate API call
    console.log("Manual submit initiated...");
    setTimeout(() => {
      setLoading(false);
      alert("Manual data processed!");
    }, 1000);
  };

  const handleFileUpload = async () => {
    // This runs AFTER FileImport.jsx finishes its loop
    console.log("Success signal received from FileImport!");
  };

  const TOPBAR_BOXES = [
    { name: "Active Project:", value: "Weather" },
    { name: "Last Update:", value: "2026-2-13 14:30" },
    { name: "Total Datasets:", value: "1,200" },
    { name: "Anomalies:", value: "4" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 4 Top Bar Containers */}
        {/* Added a 'key' here to stop React from complaining */}
        {TOPBAR_BOXES.map((topic, index) => (
          <SmallContainer key={index} topic={topic} />
        ))}
      </div>

      <div className="grid md:flex gap-4">
        <div className="flex-2">
          <Graph data={processedData} />
        </div>
        <div className="flex-1">
          <QuickActions
            onUpload={handleFileUpload}
            onManualSubmit={handleManualSubmit}
            setUploadFiles={setUploadFiles}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="">
          <AIInsight />
        </div>
        <div className="">
          <SystemMonitor />
        </div>
      </div>
    </div>
  );
};

export default Home;
