import { useEffect, useState } from 'react';
import BASE_URL from "../../api/base_url";
import { GenerateLineChart } from './Charts';
import { getTable } from "../../api/timeseries";

export default function ChartPage({ dataset }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!dataset) return;

        const res = await getTable(dataset); // 🔥 dynamic now
        setData(res);
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dataset]); // 🔥 re-fetch when dataset changes

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  // based on usr selection, pass the json data to bar chart or line or whatever chart

  return <GenerateLineChart jsonData={data} />;
}