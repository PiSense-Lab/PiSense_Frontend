import React from "react";
import SmallContainer from "../components/dashboard/SmallContainer";

const SelectedProject = ({ selectedProject }) => {
  if (!selectedProject) return null;
  console.log("Selected project data:", selectedProject);
  const numDatasets = localStorage.getItem('numofdatasets') || "0";

  const topBarData = [
    { name: "Last Update:", value: selectedProject.last_updated || "N/A" },
    { name: "Total Datasets:", value: numDatasets },
    { name: "Anomalies:", value: selectedProject.anomalies || "0" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {topBarData.map((topic, index) => (
        <SmallContainer key={index} topic={topic} />
      ))}
    </div>
  );
};

export default SelectedProject;
