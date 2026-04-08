import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";
import { buildTimeSeries } from "../../../api/charting";

export function GenerateCompareChart({ jsonData }) {
  const result = buildTimeSeries(jsonData);
  console.log("Compare Chart data:", result);

  const metricKeys = result?.metricKeys || [];

  // Default: first metric on left, second on right (if exists)
  const [leftMetric, setLeftMetric] = useState(metricKeys[0] || "");
  const [rightMetric, setRightMetric] = useState(metricKeys[1] || "");

  if (!result || metricKeys.length === 0) {
    return <div>No valid time-series data found.</div>;
  }

  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const axisValueFormatter = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return value;
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <div>
      {/* Dual Metric Selectors */}
      <div
        style={{
          marginBottom: 16,
          padding: "12px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
          display: "flex",
          gap: "24px",
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {/* Left Metric */}
        <div>
          <label
            htmlFor="left-metric"
            style={{
              display: "block",
              fontWeight: 600,
              fontSize: "13px",
              marginBottom: "6px",
            }}
          >
            Left Axis:
          </label>
          <select
            id="left-metric"
            value={leftMetric}
            onChange={(e) => setLeftMetric(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "13px",
              minWidth: "160px",
            }}
          >
            {metricKeys.map((key) => (
              <option key={key} value={key}>
                {formatLabel(key)}
              </option>
            ))}
          </select>
          <div
            style={{
              marginTop: "4px",
              width: "16px",
              height: "16px",
              backgroundColor: "hsl(210, 70%, 50%)",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Right Metric */}
        <div>
          <label
            htmlFor="right-metric"
            style={{
              display: "block",
              fontWeight: 600,
              fontSize: "13px",
              marginBottom: "6px",
            }}
          >
            Right Axis:
          </label>
          <select
            id="right-metric"
            value={rightMetric}
            onChange={(e) => setRightMetric(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "13px",
              minWidth: "160px",
            }}
          >
            {metricKeys.map((key) => (
              <option key={key} value={key}>
                {formatLabel(key)}
              </option>
            ))}
          </select>
          <div
            style={{
              marginTop: "4px",
              width: "16px",
              height: "16px",
              backgroundColor: "hsl(120, 70%, 50%)",
              borderRadius: "2px",
            }}
          />
        </div>

        {leftMetric === rightMetric && (
          <p style={{ margin: 0, fontSize: "12px", color: "#f59e0b" }}>
            ⚠️ Select different metrics for comparison
          </p>
        )}
      </div>

      {/* Dual Y-Axis Chart */}
      {leftMetric && rightMetric && leftMetric !== rightMetric && (
        <>
          <div
            style={{
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <span style={{ color: "hsl(210, 70%, 50%)" }}>
              Left Axis: {formatLabel(leftMetric)}
            </span>
            <span style={{ color: "hsl(120, 70%, 50%)" }}>
              Right Axis: {formatLabel(rightMetric)}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={result.data}>
              <CartesianGrid strokeDasharray="5 5" />

              <XAxis
                dataKey="time"
                tickFormatter={(t) => new Date(t).toLocaleDateString()}
              />

              {/* Left Y-Axis */}
              <YAxis
                yAxisId="left"
                width={60}
                tickMargin={10}
                tickFormatter={axisValueFormatter}
              />

              {/* Right Y-Axis */}
              <YAxis
                yAxisId="right"
                orientation="right"
                width={60}
                tickMargin={10}
                tickFormatter={axisValueFormatter}
              />

              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                formatter={(value) => axisValueFormatter(value)}
              />

              <Legend />

              {/* Left Metric Line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={leftMetric}
                name={formatLabel(leftMetric)}
                stroke="hsl(210, 70%, 50%)"
                dot={false}
                strokeWidth={2}
              />

              {/* Right Metric Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={rightMetric}
                name={formatLabel(rightMetric)}
                stroke="hsl(120, 70%, 50%)"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {(!leftMetric || !rightMetric || leftMetric === rightMetric) && (
        <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          <p>Select two different metrics to compare</p>
        </div>
      )}
    </div>
  );
}
