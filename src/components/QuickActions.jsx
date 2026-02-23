import React from "react";

import DropDown from "./DropDown";

const QuickActions = () => {
  return (
    <div className="flex flex-col gap-2 rounded-md px-8 py-4 bg-white dark:bg-midnight">
      <h1 className="text-lg font-semibold"> Quick Actions: </h1>
      <div className="flex flex-col gap-2 items-center *:px-4 *:py-2 *:w-full *:text-center *:rounded-full *:text-nowrap">
        <button className="bg-sky text-white">Upload CSV</button>
        <button className="bg-gray-200 dark:bg-pitch">Upload Excel</button>
        <button className="bg-gray-200 dark:bg-pitch">Manual Entry</button>
        {/* <DropDown /> */}
      </div>
    </div>
  );
};

export default QuickActions;
