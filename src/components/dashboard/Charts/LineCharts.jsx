import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect } from "react";
import { buildTimeSeries } from "../../../api/charting";
import { MetricSelectPanel } from "./chart-support/MetricSelectPanel";
import { ColorCodingPanel } from "./chart-support/ColorCodingPanel";
import usePersistentState from "../../../hooks/usePersistentState";

export function GenerateLineChart({ jsonData, persistenceScope }) {
  const result = buildTimeSeries(jsonData);
  // print data to frontend console for debugging
  console.log("Chart data:", result);
  const [lineColor, setLineColor] = usePersistentState(
    `${persistenceScope}:color`,
    "#3b82f6",
  );
  const [selectedMetric, setSelectedMetric] = usePersistentState(
    `${persistenceScope}:metric`,
    "",
  );
  const metricKeys = result?.metricKeys || [];
  const currentMetric = metricKeys.includes(selectedMetric)
    ? selectedMetric
    : metricKeys[0] || "";

  useEffect(() => {
    if (metricKeys.length > 0 && !metricKeys.includes(selectedMetric)) {
      setSelectedMetric(metricKeys[0]);
    }
  }, [metricKeys, selectedMetric, setSelectedMetric]);

  if (!result || metricKeys.length === 0) {
    return <div>No valid time-series data found.</div>;
  }

  // fallback label formatter (in case you didn’t add it in backend)
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

  return (
    <>
      <MetricSelectPanel
        value={currentMetric}
        metricKeys={result.metricKeys}
        onChange={setSelectedMetric}
        getMetricLabel={getMetricLabel}
      />

      <ColorCodingPanel
        label="Line color:"
        value={lineColor}
        onChange={setLineColor}
      />

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={result.data}
          margin={{ top: 10, right: 12, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="5 5" />

          <XAxis
            dataKey="time"
            tickFormatter={(t) => new Date(t).toLocaleDateString()}
          />

          <YAxis
            width={yAxisWidth}
            tickMargin={10}
            tickFormatter={axisValueFormatter}
          />

          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            formatter={(value) => axisValueFormatter(value)}
          />

          <Line
            key={currentMetric}
            type="monotone"
            dataKey={currentMetric}
            name={getMetricLabel(currentMetric)}
            stroke={lineColor}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
