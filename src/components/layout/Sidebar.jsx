import React from "react";
import { NavLink } from "react-router-dom";

// ICONS //
import { LuLayoutTemplate, LuChartLine, LuSettings } from "react-icons/lu";
// ICONS //

const Sidebar = () => {
  const SIDEBAR_LINKS = [
    { id: 1, path: "/", name: "Dashboard", icon: LuLayoutTemplate },
    { id: 2, path: "/data", name: "Data", icon: LuChartLine },
  ];
  return (
    <div className="flex flex-col w-16 md:w-56 fixed left-0 top-0 z-10 h-screen pt-8 px-4 bg-white dark:bg-midnight">
      {/* LOGO */}
      <NavLink to="/" end className="mb-8 block">
        <img
          src="/Logo.svg"
          alt="logo"
          className="w-36 ml-2 hidden md:flex dark:hidden"
        />
        <img
          src="/Logo-dark.svg"
          alt="logo"
          className="w-36 ml-2 hidden md:hidden md:dark:flex"
        />
        <img src="/Logo-mini.svg" alt="logo" className="w-12 flex md:hidden" />
      </NavLink>
      {/* LOGO */}

      {/* NAV LINKS */}
      <ul className="space-y-2 flex-1">
        {SIDEBAR_LINKS.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `flex w-full justify-center md:justify-start items-center md:space-x-5 py-2 md:px-5 rounded-md font-medium ${isActive ? "bg-gray-200 dark:bg-pitch dark:text-sky" : "hover:bg-gray-200 dark:text-gray-300 dark:hover:text-sky dark:hover:bg-pitch"}`
              }
            >
              <span className=""> {link.icon()} </span>
              <span className="text-s hidden md:flex"> {link.name} </span>
            </NavLink>
          </li>
        ))}
      </ul>
      {/* NAV LINKS */}

      {/* SETTINGS */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `mt-auto mb-4 flex w-full justify-center md:justify-start items-center md:space-x-5 py-2 md:px-5 rounded-md font-medium ${isActive ? "bg-gray-200 dark:bg-pitch dark:text-sky" : "hover:bg-gray-200 dark:text-gray-300 dark:hover:text-sky dark:hover:bg-pitch"}`
        }
      >
        <span className=""> {LuSettings()} </span>
        <span className="text-s hidden md:flex"> Settings </span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
