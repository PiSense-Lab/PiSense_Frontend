import React from "react";
// import IndexLineChart from "./Charts";
import ChartPage from "./ChartPage";

const Graph = ({ data, projectId, dataset }) => {
  if (!dataset) return <div>No data yet</div>;
  console.log("Graph received dataset:", dataset); // 🔥 debug lo
  console.log("Graph received projectId:", projectId); // 🔥 debug log

  return (
    <div className="flex flex-col rounded-md px-8 py-4 h-full bg-white dark:bg-midnight">
      <ChartPage dataset={dataset} />
    </div>
  );
};

export default Graph;
