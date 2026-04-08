import { useEffect, useState } from 'react';
import BASE_URL from "../../api/base_url";
import { GenerateLineChart } from './Charts';

export default function ChartPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        //get the url from the user so that we get the correct data
        const res = await fetch(`${BASE_URL}/datatables/timeseriesdata`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  // based on usr selection, pass the json data to bar chart or line or whatever chart

  return <GenerateLineChart jsonData={data} />;
}