import React from "react";
import { useState } from "react";
import ChartPage from "./ChartPage";
import { ChartTitleEditor } from "./Charts/chart-support/ChartTitleEditor";
import { ExportGraphButton } from "./Charts/chart-support/ExportGraphButton";
import { GraphTypeSwitcher } from "./Charts/chart-support/GraphTypeSwitcher";

const Graph = ({ projectId, dataset }) => {
  const [chartType, setChartType] = useState("line");
  const [chartTitle, setChartTitle] = useState("");

  if (!dataset) return <div>No data yet</div>;

  return (
    <div className="flex min-w-0 flex-col rounded-md px-5 py-5 h-full bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-4">
        <div className="flex items-center">
          <ChartTitleEditor title={chartTitle} onTitleChange={setChartTitle} />
        </div>

        <div className="flex items-center gap-3">
          <GraphTypeSwitcher chartType={chartType} onChange={setChartType} />
        </div>
      </div>

      <div className="min-w-0">
        <ChartPage
          dataset={dataset}
          projectId={projectId}
          chartType={chartType}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <ExportGraphButton />
      </div>
    </div>
  );
};

export default Graph;
