import { useId, useMemo, useState } from "react";

const THEME_COLORS = [
  "#1f2937",
  "#374151",
  "#4b5563",
  "#d1d5db",
  "#06b6d4",
  "#00a6f4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
];

const STANDARD_COLORS = [
  "#000000",
  "#7f7f7f",
  "#880015",
  "#ed1c24",
  "#ff7f27",
  "#fff200",
  "#22b14c",
  "#00a2e8",
  "#3f48cc",
  "#a349a4",
  "#ffffff",
  "#c3c3c3",
  "#b97a57",
  "#ffaec9",
  "#ffc90e",
  "#efe4b0",
  "#b5e61d",
  "#99d9ea",
  "#7092be",
  "#c8bfe7",
];

const DEFAULT_PRESETS = [...THEME_COLORS, ...STANDARD_COLORS];

export function ColorCodingPanel({
  label = "Color coding:",
  value,
  onChange,
  options = DEFAULT_PRESETS,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerId = useId();

  const palette = useMemo(() => {
    if (!options?.length) return DEFAULT_PRESETS;
    return options;
  }, [options]);

  const activeColor = value || palette[0] || "#3b82f6";

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Open color palette"
          title="Open color palette"
          className="inline-flex items-center justify-center p-0.5 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky/40 rounded-full"
        >
          <span
            aria-hidden="true"
            className="h-5 w-5 rounded-sm border border-slate-300 shadow-sm dark:border-slate-600"
            style={{ backgroundColor: activeColor }}
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-[260px] rounded-md border border-slate-300 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-midnight">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Theme Colors
              </p>
              <div className="grid grid-cols-10 gap-1.5">
                {THEME_COLORS.map((color) => {
                  const isActive =
                    color.toLowerCase() === activeColor.toLowerCase();
                  return (
                    <button
                      key={`theme-${color}`}
                      type="button"
                      title={color}
                      onClick={() => {
                        onChange(color);
                        setIsOpen(false);
                      }}
                      className={`h-5 w-5 rounded-sm border transition ${
                        isActive
                          ? "border-slate-900 ring-2 ring-sky dark:border-white"
                          : "border-slate-300 hover:scale-105 dark:border-slate-700"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Standard Colors
              </p>
              <div className="grid grid-cols-10 gap-1.5">
                {STANDARD_COLORS.map((color) => {
                  const isActive =
                    color.toLowerCase() === activeColor.toLowerCase();
                  return (
                    <button
                      key={`standard-${color}`}
                      type="button"
                      title={color}
                      onClick={() => {
                        onChange(color);
                        setIsOpen(false);
                      }}
                      className={`h-5 w-5 rounded-sm border transition ${
                        isActive
                          ? "border-slate-900 ring-2 ring-sky dark:border-white"
                          : "border-slate-300 hover:scale-105 dark:border-slate-700"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
              <label
                htmlFor={pickerId}
                className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                More Colors...
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id={pickerId}
                  type="color"
                  value={activeColor}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-8 w-11 cursor-pointer rounded border border-slate-300 bg-transparent p-0.5 dark:border-slate-700"
                />
                <span className="rounded bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {activeColor}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { DEFAULT_PRESETS };
