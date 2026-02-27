import useDarkMode from "../hooks/useDarkMode";

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
        className={`bg-white dark:bg-gray-300 w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
          isDarkMode ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default Toggle;
