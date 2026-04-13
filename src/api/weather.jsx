import { useEffect, useState } from "react";
import BASE_URL from "./base_url";
import { GenerateLineChart } from "../components/dashboard/Charts/LineCharts";
import { GenerateBarChart } from "../components/dashboard/Charts/BarCharts";
import { GenerateCompareChart } from "../components/dashboard/Charts/CompareCharts";

export default function ChartPage({ chartType = "line" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${BASE_URL}/weather/forecast-weather/daily?forecast_days=9`,
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
