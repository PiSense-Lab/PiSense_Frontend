import { IoSunny } from "react-icons/io5";
import { HiMiniMoon } from "react-icons/hi2";
import useDarkMode from "../../hooks/useDarkMode";

const Toggle = () => {
  const { toggleDarkMode, isDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`w-14 h-full flex items-center rounded-full p-1 ${
        isDarkMode ? "bg-pitch" : "bg-gray-200"
      }`}
    >
      <div
        className={`flex justify-center items-center bg-white dark:bg-gray-300 w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
          isDarkMode ? "translate-x-7" : "translate-x-0"
        }`}
      >
        <span className="text-yellow-500 flex dark:hidden ">{IoSunny()}</span>
        <span className="text-pitch hidden dark:flex dark:text-sky">
          {HiMiniMoon()}
        </span>
      </div>
    </button>
  );
};

export default Toggle;
