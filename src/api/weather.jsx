import { useEffect, useState } from 'react';
import BASE_URL from "./base_url";
import { GenerateLineChart } from '../components/dashboard/Charts';

export default function ChartPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${BASE_URL}/datatables/ExampleData`);
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

  return <GenerateLineChart jsonData={data} />;
}