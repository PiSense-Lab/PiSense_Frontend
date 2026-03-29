import React from "react";
import useDarkMode from "../../hooks/useDarkMode";

// ICONS //
import { LuBell, LuSearch, LuUser } from "react-icons/lu";
import { IoSunny } from "react-icons/io5";
import { HiMiniMoon } from "react-icons/hi2";
// ICONS //

const Header = () => {
  const { toggleDarkMode, isDarkMode } = useDarkMode();

  return (
    <>
      <div className="flex left-16 md:left-56 right-0 fixed z-10 shadow-xs md:justify-between justify-end items-center p-4 pl-1 bg-white dark:bg-midnight dark:text-white">
        <div className="hidden md:flex w-90 relative rounded-md items-center bg-gray-200 text-midnight/80 dark:text-gray-300 dark:bg-pitch">
          <LuSearch size={20} className="absolute left-3" />
          <input
            type="text"
            placeholder="Type to search..."
            className="pl-12 pr-4 py-2 w-full rounded-md outline-none focus:ring-1 placeholder-midnight/80 dark:placeholder-gray-400 dark:ring-sky"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className={`w-14 h-full flex items-center rounded-full p-1 ${isDarkMode ? "bg-pitch" : "bg-gray-200"
              }`}
          >
            <div
              className={`flex justify-center items-center bg-white dark:bg-gray-300 w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? "translate-x-7" : "translate-x-0"
                }`}
            >
              <span className="text-yellow-500 flex dark:hidden ">
                {IoSunny()}
              </span>
              <span className="text-pitch hidden dark:flex dark:text-sky">
                {HiMiniMoon()}
              </span>
            </div>
          </button>
          <button className="relative text-2xl p-2 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-pitch">
            <LuBell
              size={25}
              className="text-gray-600 dark:text-gray-300"
            ></LuBell>
            <span className="absolute flex justify-center items-center font-bold text-xs -right-0.5 -top-0.5 border-2 border-white dark:border-midnight rounded-full bg-sky text-white w-5 h-4">
              3
            </span>
          </button>
          <button className="p-2 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-pitch">
            <LuUser size={25} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
