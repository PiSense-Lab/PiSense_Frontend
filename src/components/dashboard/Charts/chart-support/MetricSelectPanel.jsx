function defaultFormatLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MetricSelectPanel({
  id = "metric-select",
  label = "Select metric:",
  value,
  metricKeys,
  onChange,
  getMetricLabel,
}) {
  const labelResolver = getMetricLabel || defaultFormatLabel;

  return (
    <div className="mb-1 flex items-center justify-start gap-3">
      <label htmlFor={id} className="text-base font-semibold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-55 rounded-md bg-slate-200 px-3 py-2 text-base font-medium focus:outline-none focus:ring-1 focus:ring-sky dark:border-slate-700 dark:bg-pitch disabled:opacity-50"
      >
        {metricKeys.map((key) => (
          <option key={key} value={key}>
            {labelResolver(key)}
          </option>
        ))}
      </select>
    </div>
  );
}
