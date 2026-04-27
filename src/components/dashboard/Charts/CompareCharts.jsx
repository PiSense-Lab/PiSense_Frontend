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
import { useEffect, useMemo } from "react";
import { buildTimeSeries } from "../../../api/charting";
import { DualMetricSelectPanel } from "./chart-support/DualMetricSelectPanel";
import { ColorCodingPanel } from "./chart-support/ColorCodingPanel";
import { getAdaptiveTimeFormatters } from "./chart-support/timeAxisFormatters";
import usePersistentState from "../../../hooks/usePersistentState";

export function GenerateCompareChart({ jsonData, persistenceScope }) {
  const result = buildTimeSeries(jsonData);
  console.log("Compare Chart data:", result);

  const metricKeys = useMemo(
    () => result?.metricKeys || [],
    [result?.metricKeys],
  );

  const [leftMetric, setLeftMetric] = usePersistentState(
    `${persistenceScope}:leftMetric`,
    "",
  );
  const [rightMetric, setRightMetric] = usePersistentState(
    `${persistenceScope}:rightMetric`,
    "",
  );
  const [leftColor, setLeftColor] = usePersistentState(
    `${persistenceScope}:leftColor`,
    "#3b82f6",
  );
  const [rightColor, setRightColor] = usePersistentState(
    `${persistenceScope}:rightColor`,
    "#22c55e",
  );
  const [sameUnits, setSameUnits] = usePersistentState(
    `${persistenceScope}:sameUnits`,
    false,
  );

  useEffect(() => {
    if (metricKeys.length === 0) return;

    if (!metricKeys.includes(leftMetric)) {
      setLeftMetric(metricKeys[0]);
    }

    if (!metricKeys.includes(rightMetric) || rightMetric === leftMetric) {
      const fallbackRight = metricKeys.find((key) => key !== leftMetric) || "";
      setRightMetric(fallbackRight);
    }
  }, [metricKeys, leftMetric, rightMetric, setLeftMetric, setRightMetric]);

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

  const { formatTick: formatXAxisTime, formatTooltip: formatTooltipTime } =
    getAdaptiveTimeFormatters(result.data);

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

      <div className="mb-2 flex flex-wrap items-center gap-4">
        <ColorCodingPanel
          label="Left axis color:"
          value={leftColor}
          onChange={setLeftColor}
        />
        <ColorCodingPanel
          label="Right axis color:"
          value={rightColor}
          onChange={setRightColor}
        />
        <label className="ml-0 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 sm:ml-auto">
          <input
            type="checkbox"
            checked={sameUnits}
            onChange={(e) => setSameUnits(e.target.checked)}
            className="h-4 w-4 cursor-pointer"
          />
          Same units (single axis)
        </label>
      </div>

      {/* Dual Y-Axis Chart */}
      {leftMetric && rightMetric && leftMetric !== rightMetric && (
        <>
          {sameUnits ? (
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold">
              <span style={{ color: leftColor }}>
                {getMetricLabel(leftMetric)}
              </span>
              <span style={{ color: rightColor }}>
                {getMetricLabel(rightMetric)}
              </span>
              <span className="text-gray-500">(Single Y-axis)</span>
            </div>
          ) : (
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold">
              <span className="min-w-0 truncate" style={{ color: leftColor }}>
                Left Axis: {getMetricLabel(leftMetric)}
              </span>
              <span className="min-w-0 truncate" style={{ color: rightColor }}>
                Right Axis: {getMetricLabel(rightMetric)}
              </span>
            </div>
          )}

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={result.data}>
              <CartesianGrid strokeDasharray="5 5" />

              <XAxis
                dataKey="time"
                tickFormatter={formatXAxisTime}
                minTickGap={24}
              />

              {sameUnits ? (
                /* Single Y-Axis Mode */
                <YAxis
                  width={60}
                  tickMargin={10}
                  tickFormatter={axisValueFormatter}
                />
              ) : (
                /* Dual Y-Axis Mode */
                <>
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
                </>
              )}

              <Tooltip
                labelFormatter={formatTooltipTime}
                formatter={(value) => axisValueFormatter(value)}
              />

              <Legend />

              {/* Left Metric Line */}
              <Line
                yAxisId={sameUnits ? undefined : "left"}
                type="monotone"
                dataKey={leftMetric}
                name={getMetricLabel(leftMetric)}
                stroke={leftColor}
                dot={false}
                strokeWidth={2}
              />

              {/* Right Metric Line */}
              <Line
                yAxisId={sameUnits ? undefined : "right"}
                type="monotone"
                dataKey={rightMetric}
                name={getMetricLabel(rightMetric)}
                stroke={rightColor}
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
