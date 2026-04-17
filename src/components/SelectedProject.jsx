import React, { useState, useEffect } from "react";
import SmallContainer from "../components/dashboard/SmallContainer";
import { getProjects } from "../api/timeseries";

// Headless UI Components
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Label,
} from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

const SelectedProject = ({ onProjectChange }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects();
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

  // Handle Listbox selection
  const handleProjectChange = (project) => {
    setSelectedProject(project);
    onProjectChange(project);
  };

  if (!selectedProject) return <div>Loading projects...</div>;
  localStorage.setItem("projectid", JSON.stringify(selectedProject.project_id));
  const topBarData = [
    { name: "Active Project:", value: selectedProject.project_name },
    { name: "Last Update:", value: selectedProject.last_update || "N/A" },
    { name: "Total Datasets:", value: selectedProject.total_datasets || "0" },
    { name: "Anomalies:", value: selectedProject.anomalies || "0" },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Styled Listbox */}
      <Listbox value={selectedProject} onChange={handleProjectChange}>
        <div className="flex flex-col rounded-md px-8 py-4 bg-white dark:bg-midnight">
          <Label className="text-lg font-semibold">
            {topBarData[0].name}
          </Label>

          <div className="relative">
            <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-200 dark:bg-pitch py-1.5 pr-2 pl-4 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                <span className="block truncate">{selectedProject.project_name}</span>
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              />
            </ListboxButton>

            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-midnight py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
              {projects.map((project) => (
                <ListboxOption
                  key={project.project_id}
                  value={project}
                  className="group relative cursor-pointer select-none py-2 pl-4 pr-10 text-gray-900 dark:text-gray-100 data-focus:bg-sky data-focus:text-white"
                >
                  <span className="block truncate font-normal group-data-selected:font-semibold">
                    {project.project_name}
                  </span>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-sky group-not-data-selected:hidden group-data-focus:text-white">
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </div>
      </Listbox>

      {/* Other top bar metrics */}
      {topBarData.slice(1).map((topic, index) => (
        <SmallContainer key={index} topic={topic} />
      ))}
    </div>
  );
};

export default SelectedProject;