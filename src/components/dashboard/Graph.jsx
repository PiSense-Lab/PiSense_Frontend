import React from "react";
import IndexLineChart from "./Charts";

const Graph = (data) => {
  if (!data) return <div>No data yet</div>;
  return (
    <div className="flex flex-col rounded-md px-8 py-4 h-full bg-white dark:bg-midnight">
      <IndexLineChart/>
    </div>
  );
};

export default Graph;
