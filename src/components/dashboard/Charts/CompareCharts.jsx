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
import { DualMetricSelectPanel } from "./chart-support/DualMetricSelectPanel";

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

  const getMetricLabel = (key) => result.labels?.[key] || formatLabel(key);

  const axisValueFormatter = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return value;
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <div>
      <DualMetricSelectPanel
        metricKeys={metricKeys}
        leftMetric={leftMetric}
        rightMetric={rightMetric}
        onLeftChange={setLeftMetric}
        onRightChange={setRightMetric}
        getMetricLabel={getMetricLabel}
      />

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
              Left Axis: {getMetricLabel(leftMetric)}
            </span>
            <span style={{ color: "hsl(120, 70%, 50%)" }}>
              Right Axis: {getMetricLabel(rightMetric)}
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
                name={getMetricLabel(leftMetric)}
                stroke="hsl(210, 70%, 50%)"
                dot={false}
                strokeWidth={2}
              />

              {/* Right Metric Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={rightMetric}
                name={getMetricLabel(rightMetric)}
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
