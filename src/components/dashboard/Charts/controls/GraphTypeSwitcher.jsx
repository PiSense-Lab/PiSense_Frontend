const CHART_TYPES = [
  { key: "line", label: "Line" },
  { key: "bar", label: "Bar" },
  { key: "dualAxis", label: "Compare" },
];

export function GraphTypeSwitcher({ chartType, onChange }) {
  return (
    <div className="flex items-center gap-3 w-fit">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
        Graph Type
      </p>

      <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
        {CHART_TYPES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              chartType === key
                ? "bg-sky text-white shadow-sm"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
