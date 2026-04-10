import { useState } from "react";

export function ChartTitleEditor({ title, onTitleChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title || "");

  const handleSave = () => {
    onTitleChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(title || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className={`rounded-md border border-transparent px-2 py-1 text-left text-3xl font-semibold leading-tight transition hover:border-slate-300 hover:bg-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800 ${
          title
            ? "text-slate-800 dark:text-slate-100"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {title || "Chart Title"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter chart title..."
        autoFocus
        className="min-w-[260px] rounded-md border-2 border-sky px-3 py-2 text-base font-semibold text-slate-800 outline-none dark:text-slate-100"
      />
      <button
        type="button"
        onClick={handleSave}
        className="whitespace-nowrap rounded-md bg-sky px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue"
      >
        Save
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className="whitespace-nowrap rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        Cancel
      </button>
    </div>
  );
}
