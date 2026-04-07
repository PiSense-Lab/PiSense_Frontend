// SelectedProject.jsx
import React, { useState, useEffect } from "react";
import SmallContainer from "../components/dashboard/SmallContainer";
import { getProjects } from "../api/timeseries.js"; // API call to your backend

const SelectedProject = ({ onProjectChange }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects(); // returns list of projects
        setProjects(allProjects);
        if (allProjects.length > 0) {
          setSelectedProject(allProjects[0]);
          onProjectChange(allProjects[0]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [onProjectChange]);

  const handleChange = (e) => {
    const project = projects.find((p) => p.project_id === e.target.value);
    setSelectedProject(project);
    onProjectChange(project);
  };

  if (!selectedProject) return <div>Loading projects...</div>;

  const topBarData = [
    { name: "Active Project:", value: selectedProject.project_name },
    { name: "Last Update:", value: selectedProject.last_update || "N/A" },
    { name: "Total Datasets:", value: selectedProject.total_datasets || "0" },
    { name: "Anomalies:", value: selectedProject.anomalies || "0" },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Dropdown for first box */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold">{topBarData[0].name}</label>
        <select
          className="border p-1 rounded"
          value={selectedProject.project_id}
          onChange={handleChange}
        >
          {projects.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_name}
            </option>
          ))}
        </select>
      </div>

      {/* Other top bar metrics */}
      {topBarData.slice(1).map((topic, index) => (
        <SmallContainer key={index} topic={topic} />
      ))}
    </div>
  );
};

export default SelectedProject;