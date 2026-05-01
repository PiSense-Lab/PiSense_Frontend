import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect, useMemo } from "react";
import { buildTimeSeries } from "../../../api/charting";
import { MetricSelectPanel } from "./chart-support/MetricSelectPanel";
import { ColorCodingPanel } from "./chart-support/ColorCodingPanel";
import { DateRangeFilterPanel } from "./chart-support/DateRangeFilterPanel";
import { ExportGraphButton } from "./chart-support/ExportGraphButton";
import { getAdaptiveTimeFormatters } from "./chart-support/timeAxisFormatters";
import usePersistentState from "../../../hooks/usePersistentState";
import useDateRangeFilter from "../../../hooks/useDateRangeFilter";

export function GenerateLineChart({ jsonData, persistenceScope, onExport }) {
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
  const metricKeys = useMemo(
    () => result?.metricKeys || [],
    [result?.metricKeys],
  );
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

  const {
    activeRange,
    startValue,
    endValue,
    minValue,
    maxValue,
    invalidRange,
    filteredData,
    onRangeChange,
    onStartChange,
    onEndChange,
  } = useDateRangeFilter({
    data: result.data,
    persistenceScope,
  });

  // fallback label formatter (in case you didn’t add it in backend)
  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const getMetricLabel = (key) => result.labels?.[key] || formatLabel(key);

  const axisValueFormatter = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return value;
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const yAxisWidth = (() => {
    const values = filteredData
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
    getAdaptiveTimeFormatters(
      filteredData.length > 0 ? filteredData : result.data,
    );

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

      {filteredData.length === 0 && !invalidRange && (
        <div className="mb-3 text-sm text-slate-500 dark:text-slate-300">
          No data points found in the selected date range.
        </div>
      )}

      <ResponsiveContainer width="100%" height={460}>
        <LineChart
          data={filteredData}
          margin={{ top: 10, right: 12, left: 8, bottom: 0 }}
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <DateRangeFilterPanel
          activeRange={activeRange}
          startValue={startValue}
          endValue={endValue}
          minValue={minValue}
          maxValue={maxValue}
          invalidRange={invalidRange}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          onRangeChange={onRangeChange}
        />

        <div className="ml-auto">
          <ExportGraphButton onClick={onExport} />
        </div>
      </div>
    </>
  );
}
