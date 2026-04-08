import React from "react";
import ChartPage from "../../api/weather";
import { useState } from "react";

const Graph = (data) => {
  const [chartType, setChartType] = useState("line");

  if (!data) return <div>No data yet</div>;
  return (
    <div className="flex flex-col rounded-md px-5 py-5 h-full bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mb-4 flex justify-end">
        <div className="flex flex-col items-center gap-2 w-fit">
          <p className="w-full text-center text-xs font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Graph Type
          </p>

          <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setChartType("line")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                chartType === "line"
                  ? "bg-sky text-white shadow-sm"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                chartType === "bar"
                  ? "bg-sky text-white shadow-sm"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("dualAxis")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                chartType === "dualAxis"
                  ? "bg-sky text-white shadow-sm"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      </div>

      <ChartPage chartType={chartType} />
    </div>
  );
};

export default Graph;
