import { 
  CartesianGrid, 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { useState } from 'react';
import { buildTimeSeries } from '../../api/charting';

export function GenerateLineChart({ jsonData }) {
  const result = buildTimeSeries(jsonData);
  const [hidden, setHidden] = useState({});

  if (!result) {
    return <div>No valid time-series data found.</div>;
  }

  // fallback label formatter (in case you didn’t add it in backend)
  const formatLabel = (key) =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={result.data}>
        <CartesianGrid strokeDasharray="5 5" />

        <XAxis
          dataKey="time"
          tickFormatter={(t) => new Date(t).toLocaleDateString()}
        />

        <YAxis />

        <Tooltip
          labelFormatter={(label) =>
            new Date(label).toLocaleDateString()
          }
        />

        <Legend
          onClick={(e) => {
            const key = e.dataKey;
            setHidden(prev => ({
              ...prev,
              [key]: !prev[key]
            }));
          }}
        />

        {result.metricKeys.map((key, index) =>
          !hidden[key] && (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={result.labels?.[key] || formatLabel(key)} // 👈 legend label
              stroke={`hsl(${index * 60}, 70%, 50%)`}
              dot={false}
            />
          )
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}