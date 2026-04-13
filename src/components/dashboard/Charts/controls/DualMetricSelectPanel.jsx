function defaultFormatLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DualMetricSelectPanel({
  metricKeys,
  leftMetric,
  rightMetric,
  onLeftChange,
  onRightChange,
  getMetricLabel,
}) {
  const labelResolver = getMetricLabel || defaultFormatLabel;

  return (
    <div className="mb-1 flex justify-start">
      <div className="flex flex-wrap items-end gap-6 rounded-md bg-transparent px-1 py-2">
        <div>
          <label
            htmlFor="left-metric"
            className="mb-1 block text-sm font-semibold"
          >
            Left Axis:
          </label>
          <select
            id="left-metric"
            value={leftMetric}
            onChange={(e) => onLeftChange(e.target.value)}
            className="min-w-[170px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            {metricKeys.map((key) => (
              <option key={key} value={key}>
                {labelResolver(key)}
              </option>
            ))}
          </select>
          <div className="mt-1 h-4 w-4 rounded-sm bg-[hsl(210,70%,50%)]" />
        </div>

        <div>
          <label
            htmlFor="right-metric"
            className="mb-1 block text-sm font-semibold"
          >
            Right Axis:
          </label>
          <select
            id="right-metric"
            value={rightMetric}
            onChange={(e) => onRightChange(e.target.value)}
            className="min-w-[170px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            {metricKeys.map((key) => (
              <option key={key} value={key}>
                {labelResolver(key)}
              </option>
            ))}
          </select>
          <div className="mt-1 h-4 w-4 rounded-sm bg-[hsl(120,70%,50%)]" />
        </div>

        {leftMetric === rightMetric && (
          <p className="m-0 text-xs text-amber-500">
            ⚠️ Select different metrics for comparison
          </p>
        )}
      </div>
    </div>
  );
}
