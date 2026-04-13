import { useEffect, useState } from "react";
import { getTable } from "../../api/timeseries";
import { GenerateLineChart } from "./Charts/LineCharts";
import { GenerateBarChart } from "./Charts/BarCharts";
import { GenerateCompareChart } from "./Charts/CompareCharts";

export default function ChartPage({ dataset, projectId, chartType = "line" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!dataset) return;

        const res = await getTable(dataset, projectId);
        setData(res);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dataset, projectId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  switch (chartType) {
    case "bar":
      return <GenerateBarChart jsonData={data} />;
    case "dualAxis":
      return <GenerateCompareChart jsonData={data} />;
    case "line":
    default:
      return <GenerateLineChart jsonData={data} />;
  }
}
