import React, { useState } from "react";

// ICONS //
import { LuLayoutTemplate, LuChartLine } from "react-icons/lu";
import { NavLink } from "react-router-dom";
// ICONS //

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const handleLinkClick = (index) => setActiveLink(index);

  const SIDEBAR_LINKS = [
    { id: 1, path: "/", name: "Dashboard", icon: LuLayoutTemplate },
    { id: 2, path: "/campaign", name: "Campaign", icon: LuChartLine },
  ];
  return (
    <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen pt-8 px-4 bg-midnight">
      {/* LOGO */}
      <div className="mb-8">
        <img src="/Logo.svg" alt="logo" className="w-45 hidden md:flex" />
        <img src="/Logo-mini.svg" alt="logo" className="w-12 flex md:hidden" />
      </div>
      {/* LOGO */}

      {/* NAV LINKS */}
      <ul className="mt-6 space-y-6">
        {SIDEBAR_LINKS.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.path}
              onClick={() => handleLinkClick(index)}
              className={`flex w-full justify-center md:justify-start items-center md:space-x-5 py-2 md:px-5 rounded-md font-medium ${activeLink === index ? "bg-evening text-sky" : "hover:bg-evening hover:text-sky text-white"}`}
            >
              <span className=""> {link.icon()} </span>
              <span className="text-s hidden md:flex"> {link.name} </span>
            </NavLink>
          </li>
        ))}
      </ul>
      {/* NAV LINKS */}
    </div>
  );
};

export default Sidebar;
