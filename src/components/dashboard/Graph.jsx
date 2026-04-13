import React from "react";
// import ChartPage from "../../api/weather";
import ChartPage from "./ChartPage";
import { useState } from "react";
import { ChartTitleEditor } from "./Charts/ChartTitleEditor";
import { GraphTypeSwitcher } from "./Charts/controls/GraphTypeSwitcher";

const Graph = ( data, projectId, dataset ) => {
  const [chartType, setChartType] = useState("line");
  const [chartTitle, setChartTitle] = useState("");

  if (!data) return <div>No data yet</div>;
  return (
    <div className="flex flex-col rounded-md px-5 py-5 h-full bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-4">
        {/* Chart Title Editor - Left Side */}
        <div className="flex items-center">
          <ChartTitleEditor title={chartTitle} onTitleChange={setChartTitle} />
        </div>

        {/* Graph Type Selector - Right Side */}
        <GraphTypeSwitcher chartType={chartType} onChange={setChartType} />
      </div>

      <ChartPage dataset={dataset} projectId={projectId} chartType={chartType} />
    </div>
  );
};

export default Graph;
