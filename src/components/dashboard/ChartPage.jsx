import { useEffect, useState } from 'react';
import BASE_URL from "../../api/base_url";
import { getTable } from "../../api/timeseries";
import { GenerateLineChart } from "../dashboard/Charts/LineCharts";
import { GenerateBarChart } from "../dashboard/Charts/BarCharts";
import { GenerateCompareChart } from "../dashboard/Charts/CompareCharts";

export default function ChartPage({ dataset, projectId, chartType = "line" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!dataset) return;

        const res = await getTable(dataset, projectId); // 🔥 dynamic now
        setData(res);
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dataset, projectId]); // 🔥 re-fetch when dataset changes

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <GenerateBarChart jsonData={data} />;
      case "dualAxis":
        return <GenerateCompareChart jsonData={data} />;
      case "line":
      default:
        return <GenerateLineChart jsonData={data} />;
    }
  };

  return renderChart();
}