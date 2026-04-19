import React, { useRef } from "react";
import domtoimage from "dom-to-image-more";
import ChartPage from "./ChartPage";
import { ChartTitleEditor } from "./Charts/chart-support/ChartTitleEditor";
import { ExportGraphButton } from "./Charts/chart-support/ExportGraphButton";
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

  const handleExportChart = async () => {
    if (!chartRef.current) return;

    try {
      const blob = await domtoimage.toBlob(chartRef.current, {
        bgcolor: "#ffffff",
        scale: 2,
        quality: 1.0,
        width: chartRef.current.offsetWidth * 2,
        height: chartRef.current.offsetHeight * 2,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chart-${chartTitle || "export"}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting chart:", error);
      // Fallback: try with minimal options
      try {
        const blob = await domtoimage.toBlob(chartRef.current, {
          bgcolor: "#ffffff",
          scale: 1,
          quality: 0.95,
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `chart-${chartTitle || "export"}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (fallbackError) {
        console.error("Fallback export also failed:", fallbackError);
        alert("Chart export failed. Please try again or contact support.");
      }
    }
  };

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
          ref={chartRef}
          dataset={dataset}
          projectId={projectId}
          chartType={chartType}
          persistenceScope={scope}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <ExportGraphButton onClick={handleExportChart} />
      </div>
    </div>
  );
};

export default Graph;
