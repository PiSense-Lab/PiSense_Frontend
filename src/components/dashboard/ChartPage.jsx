import { useEffect, useState, forwardRef } from "react";
import { getTable } from "../../api/timeseries";
import { GenerateLineChart } from "./Charts/LineCharts";
import { GenerateBarChart } from "./Charts/BarCharts";
import { GenerateCompareChart } from "./Charts/CompareCharts";

const ChartPage = forwardRef(function ChartPage(
  { dataset, projectId, chartType = "line", persistenceScope },
  ref,
) {
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

  const chartComponent = (() => {
    switch (chartType) {
      case "bar":
        return (
          <GenerateBarChart
            jsonData={data}
            persistenceScope={`${persistenceScope}:bar`}
          />
        );
      case "dualAxis":
        return (
          <GenerateCompareChart
            jsonData={data}
            persistenceScope={`${persistenceScope}:dualAxis`}
          />
        );
      case "line":
      default:
        return (
          <GenerateLineChart
            jsonData={data}
            persistenceScope={`${persistenceScope}:line`}
          />
        );
    }
  })();

  return <div ref={ref}>{chartComponent}</div>;
});

export default ChartPage;
