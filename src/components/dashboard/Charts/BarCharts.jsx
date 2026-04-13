import {
  CartesianGrid,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState } from "react";
import { buildTimeSeries } from "../../../api/charting";
import { MetricSelectPanel } from "./chart-support/MetricSelectPanel";

const CHART_HEIGHT = 400;
const POINT_WIDTH = 12;

export function GenerateBarChart({ jsonData }) {
  const result = buildTimeSeries(jsonData);
  console.log("Bar Chart data:", result);
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

  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const getMetricLabel = (key) => result.labels?.[key] || formatLabel(key);

  const axisValueFormatter = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return value;
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const yAxisWidth = (() => {
    const values = result.data
      .map((entry) => entry[currentMetric])
      .filter((value) => typeof value === "number" && Number.isFinite(value));

    if (values.length === 0) return 56;

    const maxChars = values.reduce((max, value) => {
      const formatted = String(axisValueFormatter(value));
      return Math.max(max, formatted.length);
    }, 0);

    return Math.min(92, Math.max(50, maxChars * 8 + 10));
  })();

  // Keep panel size stable; only the inner plotting canvas becomes scrollable.
  const chartWidth = Math.max(result.data.length * POINT_WIDTH, 1);

  const formatXAxisTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, {
      month: "numeric",
      day: "numeric",
      hour: "numeric",
    });
  };

  const formatTooltipTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <MetricSelectPanel
        value={currentMetric}
        metricKeys={result.metricKeys}
        onChange={setSelectedMetric}
        getMetricLabel={getMetricLabel}
      />

      <div className="w-full max-w-full min-w-0">
        <div className="w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden">
          <div
            style={{
              width: chartWidth,
              minWidth: "100%",
              height: CHART_HEIGHT,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={result.data}
                margin={{ top: 10, right: 12, left: 8, bottom: 0 }}
                barCategoryGap="20%"
                barGap={1}
                maxBarSize={18}
              >
                <CartesianGrid strokeDasharray="5 5" />

                <XAxis
                  dataKey="time"
                  tickFormatter={formatXAxisTime}
                  minTickGap={24}
                />

                <YAxis
                  width={yAxisWidth}
                  tickMargin={10}
                  tickFormatter={axisValueFormatter}
                />

                <Tooltip
                  labelFormatter={formatTooltipTime}
                  formatter={(value) => axisValueFormatter(value)}
                />

                <Bar
                  key={currentMetric}
                  dataKey={currentMetric}
                  name={getMetricLabel(currentMetric)}
                  fill="hsl(120, 70%, 50%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
