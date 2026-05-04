import React, { useRef } from "react";
 import { toPng } from "html-to-image";
import ChartPage from "./ChartPage";
import { ChartTitleEditor } from "./Charts/chart-support/ChartTitleEditor";
import { GraphTypeSwitcher } from "./Charts/chart-support/GraphTypeSwitcher";
import usePersistentState from "../../hooks/usePersistentState";

const Graph = ({ projectId, dataset }) => {
  const scope = `dashboard:${projectId ?? "no-project"}:${dataset ?? "no-dataset"}`;
  const [chartType, setChartType] = usePersistentState(
    `${scope}:chartType`,
    "line",
  );
  const [chartTitle, setChartTitle] = usePersistentState(
    `${scope}:chartTitle`,
    "",
  );
  const chartRef = useRef(null);
  const containerRef = useRef(null);

 

  const handleExportChart = async () => {
    const node = containerRef.current;
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 2, // replaces your scale logic
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `chart-${chartType}-${chartTitle || "export"}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  if (!dataset) return <div>No data yet</div>;

  return (
    <div 
      ref={containerRef}
      className="flex min-w-0 flex-col rounded-md px-5 py-5 h-full bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 shadow-sm"
    >
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
          ref={chartRef}
          dataset={dataset}
          projectId={projectId}
          chartType={chartType}
          persistenceScope={scope}
          onExport={handleExportChart}
        />
      </div>
    </div>
  );
};

export default Graph;
