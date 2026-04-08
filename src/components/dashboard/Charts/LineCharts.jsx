import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState } from "react";
import { buildTimeSeries } from "../../../api/charting";

export function GenerateLineChart({ jsonData }) {
  const result = buildTimeSeries(jsonData);
  // print data to frontend console for debugging
  console.log("Chart data:", result);
  const [selectedMetric, setSelectedMetric] = useState(
    result?.metricKeys?.[0] || "",
  );
  const metricKeys = result?.metricKeys || [];
  const currentMetric = metricKeys.includes(selectedMetric)
    ? selectedMetric
    : metricKeys[0] || "";

  if (!result || metricKeys.length === 0) {
    return <div>No valid time-series data found.</div>;
  }

  // fallback label formatter (in case you didn’t add it in backend)
  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const axisValueFormatter = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return value;
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <label htmlFor="metric-select" style={{ fontWeight: 600 }}>
          Select metric:
        </label>
        <select
          id="metric-select"
          value={currentMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          style={{ padding: "6px 10px", minWidth: 180 }}
        >
          {result.metricKeys.map((key) => (
            <option key={key} value={key}>
              {result.labels?.[key] || formatLabel(key)}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={result.data}
          margin={{ top: 10, right: 12, left: 24, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="5 5" />

          <XAxis
            dataKey="time"
            tickFormatter={(t) => new Date(t).toLocaleDateString()}
          />

          <YAxis
            width={78}
            tickMargin={10}
            tickFormatter={axisValueFormatter}
            label={{
              value:
                result.labels?.[currentMetric] || formatLabel(currentMetric),
              angle: -90,
              position: "left",
              dx: -8,
              style: { textAnchor: "middle", fontSize: 14 },
            }}
          />

          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            formatter={(value) => axisValueFormatter(value)}
          />

          <Line
            key={currentMetric}
            type="monotone"
            dataKey={currentMetric}
            name={result.labels?.[currentMetric] || formatLabel(currentMetric)}
            stroke="hsl(210, 70%, 50%)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
