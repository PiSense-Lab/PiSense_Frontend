const CHART_TYPES = [
  { key: "line", label: "Line" },
  { key: "bar", label: "Bar" },
  { key: "dualAxis", label: "Compare" },
];

export function GraphTypeSwitcher({ chartType, onChange }) {
  return (
    <div className="flex w-fit items-center gap-3">
      <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
        Graph Type
      </p>

      <div className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-midnight">
        {CHART_TYPES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              chartType === key
                ? "bg-sky text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
