import React, { useState, useRef, useEffect } from "react";
import useDarkMode from "../../hooks/useDarkMode";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../api/timeseries";

// ICONS //
import { LuUser, LuLogOut } from "react-icons/lu";
import { IoSunny } from "react-icons/io5";
import { HiMiniMoon } from "react-icons/hi2";
// ICONS //

const Header = ({ onProjectChange }) => {
  const { toggleDarkMode, isDarkMode } = useDarkMode();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects();
        setProjects(allProjects);

        if (allProjects.length > 0) {
          const savedProjectId = localStorage.getItem("selectedProjectId");
          const matchedProject = allProjects.find(
            (project) => String(project.project_id) === String(savedProjectId),
          );
          const initialProject = matchedProject ?? allProjects[0];

          setSelectedProject(initialProject);
          onProjectChange?.(initialProject);
          localStorage.setItem("projectid", JSON.stringify(initialProject.project_id));
          localStorage.setItem("selectedProjectId", String(initialProject.project_id));
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find((p) => String(p.project_id) === projectId);
    if (!project) return;

    setSelectedProject(project);
    onProjectChange?.(project);
    localStorage.setItem("projectid", JSON.stringify(project.project_id));
    localStorage.setItem("selectedProjectId", String(project.project_id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex left-16 md:left-56 right-0 fixed z-10 shadow-xs md:justify-between justify-end items-center p-4 pl-1 bg-white dark:bg-midnight dark:text-white">
      {/* Project Selector */}
      <div className="mb-1 flex items-center justify-start gap-3">
        <label className="text-base font-semibold whitespace-nowrap">
          Active Project:
        </label>
        <select
          value={selectedProject?.project_id ?? ""}
          onChange={handleProjectChange}
          disabled={projects.length === 0}
          className="min-w-55 rounded-md bg-slate-200 px-3 py-2 text-base font-medium focus:outline-none focus:ring-1 focus:ring-sky dark:border-slate-700 dark:bg-pitch disabled:opacity-50"
        >
          {projects.length === 0 && (
            <option value="">Loading projects...</option>
          )}
          {projects.map((project) => (
            <option key={project.project_id} value={String(project.project_id)}>
              {project.project_name}
            </option>
          ))}
        </select>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={`w-14 h-full flex items-center rounded-full p-1 ${isDarkMode ? "bg-pitch" : "bg-slate-200"
            }`}
        >
          <div
            className={`flex justify-center items-center bg-white dark:bg-gray-300 w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? "translate-x-7" : "translate-x-0"
              }`}
          >
            <span className="text-yellow-500 flex dark:hidden">{IoSunny()}</span>
            <span className="text-pitch hidden dark:flex dark:text-sky">{HiMiniMoon()}</span>
          </div>
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="p-2 flex items-center justify-center rounded-full text-gray-600 hover:bg-slate-200 dark:text-gray-300 dark:hover:bg-pitch"
          >
            <LuUser size={25} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-midnight border border-slate-200 dark:border-pitch rounded-md shadow-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-pitch"
              >
                <LuLogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;