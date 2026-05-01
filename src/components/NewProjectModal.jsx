import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { createProject } from "../api/timeseries"; // adjust path

const NewProjectModal = ({ onClose, onSuccess }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!projectName.trim()) {
      setNameError(true);
      return;
    }

    setLoading(true);

    const userId = localStorage.getItem("user_id");

    const result = await createProject(
      projectName.trim(),
      userId,
      description.trim(),
      isPublic,
      false // archived default
    );

    setLoading(false);

    if (result?.success === false) {
      console.error(result.message);
      return;
    }

    onSuccess?.(result);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-midnight bg-white dark:bg-midnight text-slate-800 dark:text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-midnight bg-slate-50 dark:bg-pitch">
          <div>
            <h3 className="font-bold text-base">Create New Project</h3>
            <p className="text-sm text-slate-400">
              Set up a new project workspace
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-100 dark:bg-pitch text-slate-400 hover:text-red-500 transition"
          >
            <RxCross2 size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>

            <input
              autoFocus
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setNameError(false);
              }}
              placeholder="My awesome project…"
              className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none transition
                bg-slate-100 dark:bg-pitch border
                ${
                  nameError
                    ? "border-red-500 ring-2 ring-red-500/20"
                    : projectName
                    ? "border-sky ring-2 ring-sky/20"
                    : "border-slate-200 dark:border-midnight"
                }`}
            />

            {nameError && (
              <p className="text-xs mt-1 text-red-500">
                Project name is required.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition
                bg-slate-100 dark:bg-pitch border border-slate-200 dark:border-midnight"
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-slate-50 dark:bg-pitch border border-slate-200 dark:border-midnight">
            <div>
              <p className="text-sm font-medium">Public Project</p>
              <p className="text-xs text-slate-400">
                Allow others to view this project
              </p>
            </div>

            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-11 h-6 flex items-center rounded-full transition ${
                isPublic ? "bg-sky" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                  isPublic ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-midnight bg-slate-50 dark:bg-pitch">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-midnight text-slate-400 hover:text-sky hover:border-sky transition"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-7 py-2 rounded-lg text-sm font-bold text-white bg-sky hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </>
  );
};

export default NewProjectModal;