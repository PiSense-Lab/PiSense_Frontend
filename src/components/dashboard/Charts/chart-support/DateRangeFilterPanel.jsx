const RANGE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "Custom", value: "custom" },
];

export function DateRangeFilterPanel({
  activeRange,
  startValue,
  endValue,
  minValue,
  maxValue,
  invalidRange,
  dataRangeSpan,
  onStartChange,
  onEndChange,
  onRangeChange,
}) {
  const isCustom = activeRange === "custom";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-fit flex-wrap items-center gap-3">
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
          Date range:
        </p>

        <div className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-midnight">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onRangeChange(option.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                activeRange === option.value
                  ? "bg-sky text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isCustom && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="range-start"
              className="text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              Start
            </label>
            <input
              id="range-start"
              type="datetime-local"
              value={startValue}
              min={minValue}
              max={maxValue}
              onChange={(event) => onStartChange(event.target.value)}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="range-end"
              className="text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              End
            </label>
            <input
              id="range-end"
              type="datetime-local"
              value={endValue}
              min={minValue}
              max={maxValue}
              onChange={(event) => onEndChange(event.target.value)}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {invalidRange && (
        <p className="mt-2 w-full text-xs font-medium text-rose-600 dark:text-rose-300">
          Start date must be before end date.
        </p>
      )}

      {dataRangeSpan && (
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Available data: {dataRangeSpan}
        </p>
      )}
    </div>
  );
}
