import React, { useState, useRef } from "react";
import ReactDom from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { submitManualData } from "../api/timeseries";

const DEFAULT_COL_WIDTH = 180;
const ROW_NUM_WIDTH = 52;


// ── Theme tokens ──────────────────────────────────────────────────────────────
const T = {
  cyan:        "#00BFFF",
  cyanDim:     "rgba(0,191,255,0.15)",
  cyanDimDark: "rgba(0,191,255,0.10)",
  muted:       "#94a3b8",
};

// ── Dataset categories ────────────────────────────────────────────────────────
const DATASET_TYPES = [
  { value: "weather",     label: "Weather",     icon: "🌤️" },
  { value: "sensor",      label: "Sensor",      icon: "📡" },
  { value: "financial",   label: "Financial",   icon: "💹" },
  { value: "health",      label: "Health",      icon: "🩺" },
  { value: "environment", label: "Environment", icon: "🌿" },
  { value: "energy",      label: "Energy",      icon: "⚡" },
  { value: "transport",   label: "Transport",   icon: "🚗" },
  { value: "custom",      label: "Custom",      icon: "🗂️" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SubmitModal — dataset name + dataset type
// ─────────────────────────────────────────────────────────────────────────────
const SubmitModal = ({ columns, rows, onConfirm, onBack, darkMode }) => {
  const dk = darkMode;

  const [datasetName,  setDatasetName]  = useState("");
  const [datasetType,  setDatasetType]  = useState("");
  const [customLabel,  setCustomLabel]  = useState("");
  const [nameError,    setNameError]    = useState(false);
  const [typeError,    setTypeError]    = useState(false);
  const customInputRef = useRef(null);

  const handleConfirm = () => {
    let hasError = false;
    if (!datasetName.trim()) { setNameError(true); hasError = true; }
    if (!datasetType)        { setTypeError(true); hasError = true; }
    if (hasError) return;
    const resolvedType = datasetType === "custom" ? (customLabel.trim() || "Custom") : datasetType;
    onConfirm({ datasetName: datasetName.trim(), datasetType: resolvedType });
  };

  const bg      = dk ? "#0f172a" : "#ffffff";
  const surface = dk ? "#1e293b" : "#f8fafc";
  const border  = dk ? "#1e3a5f" : "#e2e8f0";
  const text    = dk ? "#e2e8f0" : "#1e293b";
  const subtle  = dk ? "#334155" : "#cbd5e1";

  const filledRows = rows.filter(r => Object.values(r.cells).some(v => v !== "" && v !== undefined)).length;

  return (
    <>
      <div className="fixed inset-0 z-[1010]" style={{ background: "rgba(0,0,0,0.5)" }} />

      <div
        className="fixed z-[1011] flex flex-col rounded-2xl overflow-hidden"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(520px, 92vw)",
          background: bg,
          color: text,
          boxShadow: `0 30px 70px rgba(0,0,0,0.4), 0 0 0 1px ${border}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${border}`, background: surface }}>
          <div>
            <h3 className="font-bold text-base" style={{ color: text }}>Save Dataset</h3>
            <p className="text-sm mt-0.5" style={{ color: T.muted }}>
              Almost there — just tell us what this dataset is
            </p>
          </div>
          <button
            onClick={onBack}
            className="p-2 rounded-lg"
            style={{ color: T.muted, background: dk ? "#0f172a" : "#f1f5f9" }}
            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >
            <RxCross2 size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Dataset name */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: text }}>
              Dataset Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              autoFocus
              value={datasetName}
              onChange={e => { setDatasetName(e.target.value); setNameError(false); }}
              placeholder="Give your dataset a name…"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                background: dk ? "#111827" : "#f1f5f9",
                color:      text,
                border:     `1.5px solid ${nameError ? "#ef4444" : datasetName ? T.cyan : border}`,
                boxShadow:  nameError ? "0 0 0 3px rgba(239,68,68,0.15)" : datasetName ? `0 0 0 3px ${T.cyanDim}` : "none",
              }}
              onKeyDown={e => e.key === "Enter" && handleConfirm()}
            />
            {nameError && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>Please enter a name for this dataset.</p>}
          </div>

          {/* Dataset type grid */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: text }}>
              Dataset Type <span style={{ color: "#ef4444" }}>*</span>
              <span className="ml-2 text-xs font-normal" style={{ color: T.muted }}>What kind of data is this?</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DATASET_TYPES.map(dt => {
                const active = datasetType === dt.value;
                const isCustom = dt.value === "custom";
                return (
                  <button
                    key={dt.value}
                    onClick={() => {
                      setDatasetType(dt.value);
                      setTypeError(false);
                      if (isCustom) setTimeout(() => customInputRef.current?.focus(), 50);
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-xs font-medium transition-all"
                    style={{
                      background: active ? T.cyanDim : (dk ? "#111827" : "#f8fafc"),
                      border:     `1.5px solid ${active ? T.cyan : typeError ? "#ef444444" : border}`,
                      color:      active ? T.cyan : T.muted,
                      boxShadow:  active ? `0 0 0 3px ${T.cyanDim}` : "none",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{dt.icon}</span>
                    {isCustom && active ? (
                      <input
                        ref={customInputRef}
                        value={customLabel}
                        onChange={e => setCustomLabel(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        onKeyDown={e => { e.stopPropagation(); if (e.key === "Enter") handleConfirm(); }}
                        placeholder="Type name…"
                        className="w-full text-center outline-none rounded bg-transparent text-xs mt-0.5"
                        style={{
                          borderBottom: `1px solid ${T.cyan}`,
                          color: T.cyan,
                          caretColor: T.cyan,
                          minWidth: 0,
                        }}
                      />
                    ) : dt.label}
                  </button>
                );
              })}
            </div>
            {typeError && <p className="text-xs mt-1.5" style={{ color: "#ef4444" }}>Please select a dataset type.</p>}
          </div>

          {/* Summary */}
          <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: T.cyanDim, border: `1px solid ${T.cyan}44` }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <p className="text-sm" style={{ color: T.cyan }}>
              <span className="font-bold">{filledRows} rows</span>
              <span style={{ color: T.muted }}> · {columns.length} columns will be submitted</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${border}`, background: surface }}>
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-lg text-sm font-medium border transition-all"
            style={{ borderColor: subtle, color: T.muted, background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = subtle; e.currentTarget.style.color = T.muted; }}
          >
            ← Back to Grid
          </button>
          <button
            onClick={handleConfirm}
            className="px-7 py-2 rounded-lg text-sm font-bold text-white transition-all"
            style={{ background: T.cyan, boxShadow: `0 4px 20px rgba(0,191,255,0.35)` }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Spreadsheet component
// ─────────────────────────────────────────────────────────────────────────────
const Spreadsheet = ({ open, onClose, darkMode = false }) => {
  const [columns, setColumns] = useState([
    { id: "col-1", name: "Column 1", width: DEFAULT_COL_WIDTH },
    { id: "col-2", name: "Column 2", width: DEFAULT_COL_WIDTH },
    { id: "col-3", name: "Column 3", width: DEFAULT_COL_WIDTH },
  ]);
  const [rows, setRows] = useState(
    Array.from({ length: 20 }, (_, i) => ({ id: `row-${i + 1}`, cells: {} }))
  );
  const [selectedCell, setSelectedCell]   = useState(null);
  const [editingHeader, setEditingHeader] = useState(null);
  const [status, setStatus]               = useState("");
  const [showConfirm, setShowConfirm]     = useState(false);

  const headerInputRef = useRef(null);
  const resizingCol    = useRef(null);
  const startX         = useRef(null);
  const startWidth     = useRef(null);

  if (!open) return null;

  const dk = darkMode;

  const handleCellChange = (rowId, colId, value) =>
    setRows(rows.map(r => r.id === rowId ? { ...r, cells: { ...r.cells, [colId]: value } } : r));

  const startEditHeader = (colId) => {
    setEditingHeader(colId);
    setTimeout(() => headerInputRef.current?.select(), 0);
  };

  const commitHeader = (colId, value) => {
    setColumns(cols => cols.map(c => c.id === colId ? { ...c, name: value || c.name } : c));
    setEditingHeader(null);
  };

  const addColumn = () => {
    const newId = `col-${Date.now()}`;
    setColumns(cols => [...cols, { id: newId, name: `Column ${cols.length + 1}`, width: DEFAULT_COL_WIDTH }]);
  };

  const deleteColumn = (colId) => {
    if (columns.length <= 1) return;
    setColumns(cols => cols.filter(c => c.id !== colId));
    setRows(rows.map(r => { const cells = { ...r.cells }; delete cells[colId]; return { ...r, cells }; }));
  };

  const addRows = (count = 10) =>
    setRows(r => [...r, ...Array.from({ length: count }, (_, i) => ({ id: `row-${Date.now()}-${i}`, cells: {} }))]);

  const deleteRow = (rowId) => setRows(rows.filter(r => r.id !== rowId));

  const onResizeMouseDown = (e, colId) => {
    e.preventDefault();
    resizingCol.current  = colId;
    startX.current       = e.clientX;
    startWidth.current   = columns.find(c => c.id === colId).width;
    const onMove = (ev) => {
      const delta = ev.clientX - startX.current;
      setColumns(cols => cols.map(c =>
        c.id === resizingCol.current ? { ...c, width: Math.max(80, startWidth.current + delta) } : c
      ));
    };
    const onUp = () => { resizingCol.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleConfirm = async ({ datasetName, datasetType }) => {
    setShowConfirm(false);
    setStatus("Saving…");
    const cleanData = rows
      .filter(r => Object.values(r.cells).some(v => v !== "" && v !== undefined))
      .map(r => { const obj = {}; columns.forEach(c => { obj[c.name] = r.cells[c.id] ?? ""; }); return obj; });

    const result = await submitManualData({ datasetName, datasetType, rows: cleanData });
    if (result.success) {
      setStatus("✅ Dataset saved!");
      setTimeout(() => { onClose(); setStatus(""); }, 1500);
    } else {
      setStatus(`❌ ${result.message}`);
    }
  };

  const totalGridWidth = ROW_NUM_WIDTH + columns.reduce((s, c) => s + c.width, 0) + 44;

  const s = {
    modal:        { background: dk ? "#0f172a" : "#ffffff", color: dk ? "#e2e8f0" : "#1e293b" },
    titleBar:     { background: dk ? "#111827" : "#f8fafc", borderBottom: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}` },
    toolbar:      { background: dk ? "#1e293b" : "#f1f5f9", borderBottom: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}` },
    grid:         { background: dk ? "#0f172a" : "#ffffff" },
    colHead:      { background: dk ? "#1a2744" : "#eef2f7", borderRight: `1px solid ${dk ? "#1e3a5f" : "#dde3ec"}`, borderBottom: `2px solid ${T.cyan}` },
    rowNum:       (active) => ({ background: active ? (dk ? T.cyanDimDark : T.cyanDim) : (dk ? "#111827" : "#f4f7fb"), borderRight: `1px solid ${dk ? "#1e3a5f" : "#dde3ec"}`, borderBottom: `1px solid ${dk ? "#1a2e4a" : "#eef2f7"}`, color: T.muted }),
    cellBase:     (even, sel) => ({
      background:    sel ? (dk ? T.cyanDimDark : T.cyanDim) : (even ? (dk ? "#0f172a" : "#ffffff") : (dk ? "#131f35" : "#f8fafc")),
      borderRight:   `1px solid ${dk ? "#1a2e4a" : "#eef2f7"}`,
      borderBottom:  `1px solid ${dk ? "#1a2e4a" : "#eef2f7"}`,
      outline:       sel ? `2px solid ${T.cyan}` : "none",
      outlineOffset: -2,
    }),
    footer:       { background: dk ? "#111827" : "#f8fafc", borderTop: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}` },
    btnSecondary: { borderColor: dk ? "#334155" : "#cbd5e1", color: dk ? "#94a3b8" : "#64748b", background: "transparent" },
  };

  return ReactDom.createPortal(
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[1000]" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose} />

      {/* Spreadsheet modal */}
      <div
        className="fixed inset-4 md:inset-6 z-[1001] flex flex-col overflow-hidden rounded-2xl"
        style={{ ...s.modal, boxShadow: `0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px ${dk ? "#1e3a5f" : "#e2e8f0"}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 py-4 select-none" style={s.titleBar}>
          <div>
            <h2 className="font-bold text-lg tracking-tight" style={{ color: dk ? "#f1f5f9" : "#0f172a" }}>
              Manual Dataset Entry
            </h2>
            <p className="text-sm mt-0.5" style={{ color: T.muted }}>
              Add or edit rows below · <span style={{ color: T.cyan }}>double-click a header</span> to rename
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: T.muted, background: dk ? "#1e293b" : "#f1f5f9" }}
            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >
            <RxCross2 size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-6 py-2.5 select-none" style={s.toolbar}>
          {[["+ Add Rows", () => addRows(10)], ["+ Add Column", addColumn]].map(([label, fn]) => (
            <button
              key={label} onClick={fn}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all border"
              style={s.btnSecondary}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = s.btnSecondary.borderColor; e.currentTarget.style.color = s.btnSecondary.color; }}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto text-sm" style={{ color: T.muted }}>
            {rows.length} rows &nbsp;·&nbsp; {columns.length} columns
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto" style={s.grid}>
          <table className="border-collapse" style={{ minWidth: totalGridWidth, tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: ROW_NUM_WIDTH }} />
              {columns.map(c => <col key={c.id} style={{ width: c.width }} />)}
              <col style={{ width: 44 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...s.colHead, position: "sticky", top: 0, left: 0, zIndex: 30, width: ROW_NUM_WIDTH }} />
                {columns.map(col => (
                  <th key={col.id} style={{ ...s.colHead, position: "sticky", top: 0, zIndex: 20, padding: 0, overflow: "hidden", userSelect: "none" }}>
                    <div className="relative flex items-center" style={{ height: 36 }}>
                      {editingHeader === col.id ? (
                        <input
                          ref={headerInputRef}
                          defaultValue={col.name}
                          autoFocus
                          className="absolute inset-0 w-full h-full text-sm font-semibold text-center outline-none px-3"
                          style={{ background: dk ? "#0f172a" : "#fff", color: dk ? "#e2e8f0" : "#0f172a", border: `2px solid ${T.cyan}`, zIndex: 5 }}
                          onBlur={e => commitHeader(col.id, e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") commitHeader(col.id, e.target.value); if (e.key === "Escape") setEditingHeader(null); }}
                        />
                      ) : (
                        <span
                          className="flex-1 text-sm font-semibold text-center truncate px-3 cursor-pointer"
                          style={{ color: dk ? "#93c5fd" : "#334155" }}
                          onDoubleClick={() => startEditHeader(col.id)}
                          title="Double-click to rename"
                        >
                          {col.name}
                        </span>
                      )}
                      <button
                        onClick={() => deleteColumn(col.id)}
                        title="Remove column"
                        className="absolute right-1 top-1 w-5 h-5 flex items-center justify-center rounded text-xs transition-all"
                        style={{ opacity: 0, color: "#ef4444", background: "transparent" }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = dk ? "#450a0a" : "#fee2e2"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = 0; e.currentTarget.style.background = "transparent"; }}
                      >✕</button>
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors"
                        style={{ background: "transparent" }}
                        onMouseDown={e => onResizeMouseDown(e, col.id)}
                        onMouseEnter={e => e.currentTarget.style.background = T.cyan}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      />
                    </div>
                  </th>
                ))}
                <th style={{ ...s.colHead, position: "sticky", top: 0, zIndex: 20, width: 44, minWidth: 44 }}>
                  <button onClick={addColumn} className="w-full flex items-center justify-center text-xl font-light transition-colors" style={{ height: 36, color: T.muted }}
                    onMouseEnter={e => e.currentTarget.style.color = T.cyan}
                    onMouseLeave={e => e.currentTarget.style.color = T.muted}
                  >+</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.id} style={{ height: 36 }}>
                  <td
                    style={{ ...s.rowNum(selectedCell?.rowId === row.id), textAlign: "center", fontSize: 12, position: "sticky", left: 0, zIndex: 10, userSelect: "none", cursor: "default" }}
                    onContextMenu={e => { e.preventDefault(); deleteRow(row.id); }}
                    title="Right-click to delete row"
                  >
                    {ri + 1}
                  </td>
                  {columns.map(col => {
                    const isSel = selectedCell?.rowId === row.id && selectedCell?.colId === col.id;
                    return (
                      <td key={col.id} style={{ ...s.cellBase(ri % 2 === 0, isSel), padding: 0 }} onClick={() => setSelectedCell({ rowId: row.id, colId: col.id })}>
                        <input
                          value={row.cells[col.id] ?? ""}
                          onChange={e => handleCellChange(row.id, col.id, e.target.value)}
                          onFocus={() => setSelectedCell({ rowId: row.id, colId: col.id })}
                          className="w-full block outline-none bg-transparent"
                          style={{ padding: "0 12px", fontSize: 14, height: 36, fontFamily: "inherit", color: dk ? "#e2e8f0" : "#1e293b", caretColor: T.cyan }}
                        />
                      </td>
                    );
                  })}
                  <td style={{ borderBottom: `1px solid ${dk ? "#1a2e4a" : "#eef2f7"}` }} />
                </tr>
              ))}
              <tr>
                <td colSpan={columns.length + 2} style={{ background: dk ? "#0b1120" : "#f8fafc" }}>
                  <button onClick={() => addRows(10)} className="w-full py-3 text-sm transition-colors" style={{ color: T.muted }}
                    onMouseEnter={e => e.currentTarget.style.color = T.cyan}
                    onMouseLeave={e => e.currentTarget.style.color = T.muted}
                  >+ Add 10 more rows</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3" style={s.footer}>
          <span className="text-sm font-medium" style={{ color: status.startsWith("❌") ? "#ef4444" : T.cyan, minHeight: 20 }}>
            {status}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-medium border transition-all"
              style={s.btnSecondary}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = s.btnSecondary.borderColor; e.currentTarget.style.color = s.btnSecondary.color; }}
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-7 py-2 rounded-lg text-sm font-bold text-white transition-all"
              style={{ background: T.cyan, boxShadow: `0 4px 20px rgba(0,191,255,0.35)` }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Submit Dataset →
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <SubmitModal
          columns={columns}
          rows={rows}
          darkMode={darkMode}
          onConfirm={handleConfirm}
          onBack={() => setShowConfirm(false)}
        />
      )}
    </>,
    document.getElementById("portal")
  );
};

export default Spreadsheet;