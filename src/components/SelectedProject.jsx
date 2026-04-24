import React from "react";
import SmallContainer from "../components/dashboard/SmallContainer";

const SelectedProject = ({ selectedProject }) => {
  if (!selectedProject) return null;

  const topBarData = [
    { name: "Last Update:", value: selectedProject.last_update || "N/A" },
    { name: "Total Datasets:", value: selectedProject.total_datasets || "0" },
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