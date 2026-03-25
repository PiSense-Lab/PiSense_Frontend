import React, { useState, useRef } from "react";
import { RxCross2 } from "react-icons/rx";

const DATASET_TYPES = [
  { value: "weather", label: "Weather", icon: "🌤️" },
  { value: "sensor", label: "Sensor", icon: "📡" },
  { value: "financial", label: "Financial", icon: "💹" },
  { value: "health", label: "Health", icon: "🩺" },
  { value: "environment", label: "Environment", icon: "🌿" },
  { value: "energy", label: "Energy", icon: "⚡" },
  { value: "transport", label: "Transport", icon: "🚗" },
  { value: "custom", label: "Custom", icon: "🗂️" },
];

const SubmitModal = ({ columns, rows, onConfirm, onBack }) => {
  const [datasetName, setDatasetName] = useState("");
  const [datasetType, setDatasetType] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);

  const customInputRef = useRef(null);

  const handleConfirm = () => {
    let hasError = false;

    if (!datasetName.trim()) {
      setNameError(true);
      hasError = true;
    }

    if (!datasetType) {
      setTypeError(true);
      hasError = true;
    }

    if (hasError) return;

    const resolvedType =
      datasetType === "custom" ? customLabel.trim() || "Custom" : datasetType;

    onConfirm({
      datasetName: datasetName.trim(),
      datasetType: resolvedType,
    });
  };

  const filledRows = rows.filter((r) =>
    Object.values(r.cells).some((v) => v !== "" && v !== undefined),
  ).length;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50" />

      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-midnight bg-white dark:bg-midnight text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-midnight bg-slate-50 dark:bg-pitch">
          <div>
            <h3 className="font-bold text-base">Save Dataset</h3>
            <p className="text-sm text-slate-400">
              Almost there — just tell us what this dataset is
            </p>
          </div>

          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 dark:bg-pitch text-slate-400 hover:text-red-500 transition"
          >
            <RxCross2 size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Dataset Name */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Dataset Name <span className="text-red-500">*</span>
            </label>

            <input
              autoFocus
              value={datasetName}
              onChange={(e) => {
                setDatasetName(e.target.value);
                setNameError(false);
              }}
              placeholder="Give your dataset a name…"
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none transition
                bg-slate-100 dark:bg-pitch
                border
                ${
                  nameError
                    ? "border-red-500 ring-2 ring-red-500/20"
                    : datasetName
                      ? "border-sky ring-2 ring-sky/20"
                      : "border-slate-200 dark:border-midnight"
                }`}
            />

            {nameError && (
              <p className="text-xs mt-1 text-red-500">
                Please enter a name for this dataset.
              </p>
            )}
          </div>

          {/* Dataset Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Dataset Type <span className="text-red-500">*</span>
              <span className="ml-2 text-xs font-normal text-slate-400">
                What kind of data is this?
              </span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {DATASET_TYPES.map((dt) => {
                const active = datasetType === dt.value;
                const isCustom = dt.value === "custom";

                return (
                  <button
                    key={dt.value}
                    onClick={() => {
                      setDatasetType(dt.value);
                      setTypeError(false);

                      if (isCustom) {
                        setTimeout(() => customInputRef.current?.focus(), 50);
                      }
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-xs font-medium transition
                      border
                      ${
                        active
                          ? "border-sky bg-sky/10 text-sky ring-2 ring-sky/20"
                          : typeError
                            ? "border-red-400/40"
                            : "border-slate-200 dark:border-midnight"
                      }
                      bg-slate-50 dark:bg-pitch
                      text-slate-400
                    `}
                  >
                    <span className="text-[22px]">{dt.icon}</span>

                    {isCustom && active ? (
                      <input
                        ref={customInputRef}
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === "Enter") handleConfirm();
                        }}
                        placeholder="Type name…"
                        className="w-full text-center bg-transparent outline-none text-xs mt-0.5 border-b border-sky text-sky caret-sky"
                      />
                    ) : (
                      dt.label
                    )}
                  </button>
                );
              })}
            </div>

            {typeError && (
              <p className="text-xs mt-1.5 text-red-500">
                Please select a dataset type.
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 bg-sky/10 border border-sky/30">
            <span className="text-xl">📊</span>
            <p className="text-sm text-sky">
              <span className="font-bold">{filledRows} rows</span>
              <span className="text-slate-400">
                {" "}
                · {columns.length} columns will be submitted
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-midnight bg-slate-50 dark:bg-pitch">
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-midnight text-slate-400 hover:text-sky hover:border-sky transition"
          >
            Back to Grid
          </button>

          <button
            onClick={handleConfirm}
            className="px-7 py-2 rounded-lg text-sm font-bold text-white bg-sky hover:opacity-90 transition"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default SubmitModal;
