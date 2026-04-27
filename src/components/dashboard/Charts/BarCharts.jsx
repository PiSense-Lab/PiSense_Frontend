import {
  CartesianGrid,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect } from "react";
import { buildTimeSeries } from "../../../api/charting";
import { MetricSelectPanel } from "./chart-support/MetricSelectPanel";
import { ColorCodingPanel } from "./chart-support/ColorCodingPanel";
import { getAdaptiveTimeFormatters } from "./chart-support/timeAxisFormatters";
import usePersistentState from "../../../hooks/usePersistentState";

const CHART_HEIGHT = 400;

export function GenerateBarChart({ jsonData, persistenceScope }) {
  const result = buildTimeSeries(jsonData);
  console.log("Bar Chart data:", result);
  const [barColor, setBarColor] = usePersistentState(
    `${persistenceScope}:color`,
    "#22c55e",
  );
  const [selectedMetric, setSelectedMetric] = usePersistentState(
    `${persistenceScope}:metric`,
    "",
  );
  const metricKeys = result?.metricKeys;
  const currentMetric = metricKeys?.includes(selectedMetric)
    ? selectedMetric
    : metricKeys?.[0] || "";

  useEffect(() => {
    if (metricKeys?.length > 0 && !metricKeys.includes(selectedMetric)) {
      setSelectedMetric(metricKeys[0]);
    }
  }, [metricKeys, selectedMetric, setSelectedMetric]);

  if (!result || !metricKeys || metricKeys.length === 0) {
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

  const { formatTick: formatXAxisTime, formatTooltip: formatTooltipTime } =
    getAdaptiveTimeFormatters(result.data);

  return (
    <>
      <MetricSelectPanel
        value={currentMetric}
        metricKeys={result.metricKeys}
        onChange={setSelectedMetric}
        getMetricLabel={getMetricLabel}
      />

      <ColorCodingPanel
        label="Bar color:"
        value={barColor}
        onChange={setBarColor}
      />

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
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
            fill={barColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
