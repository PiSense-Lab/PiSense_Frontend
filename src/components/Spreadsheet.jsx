import React, { useState, useRef } from "react";
import ReactDom from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { submitManualData } from "../api/timeseries";
import SubmitModal from "./SubmitModal";
import DATA from "../data.js";

const DEFAULT_COL_WIDTH = 180;
const ROW_NUM_WIDTH = 52;

const transformDataToTable = (data) => {
  if (!data || data.length === 0) {
    return { columns: [], rows: [] };
  }

  const keys = Object.keys(data[0]);

  // Create columns
  const columns = keys.map((key, i) => ({
    id: `col-${i}`,
    name: key,
    width: DEFAULT_COL_WIDTH,
  }));

  // Create rows
  const rows = data.map((item, ri) => {
    const cells = {};

    columns.forEach((col, ci) => {
      cells[col.id] = item[keys[ci]] ?? "";
    });

    return {
      id: `row-${ri}`,
      cells,
    };
  });

  return { columns, rows };
};

const Spreadsheet = ({ open, onClose, darkMode = false }) => {
  const { columns: initialColumns, rows: initialRows } =
    transformDataToTable(DATA);

  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState(initialRows);

  const [selectedCell, setSelectedCell] = useState(null);
  const [editingHeader, setEditingHeader] = useState(null);
  const [status, setStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [resizingColumnId, setResizingColumnId] = useState(null);

  const headerInputRef = useRef(null);
  const resizingCol = useRef(null);
  const startX = useRef(null);
  const startWidth = useRef(null);

  if (!open) return null;

  // ─────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────

  const handleCellChange = (rowId, colId, value) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, cells: { ...r.cells, [colId]: value } } : r,
      ),
    );
  };

  const commitHeader = (colId, value) => {
    setColumns((cols) =>
      cols.map((c) => (c.id === colId ? { ...c, name: value || c.name } : c)),
    );
    setEditingHeader(null);
  };

  const addColumn = () => {
    const id = `col-${Date.now()}`;
    setColumns((cols) => [
      ...cols,
      { id, name: `Column ${cols.length + 1}`, width: DEFAULT_COL_WIDTH },
    ]);
  };

  const deleteColumn = (colId) => {
    if (columns.length <= 1) return;

    setColumns((cols) => cols.filter((c) => c.id !== colId));
    setRows((prev) =>
      prev.map((r) => {
        const cells = { ...r.cells };
        delete cells[colId];
        return { ...r, cells };
      }),
    );
  };

  const addRows = (count = 10) => {
    setRows((prev) => [
      ...prev,
      ...Array.from({ length: count }, (_, i) => ({
        id: `row-${Date.now()}-${i}`,
        cells: {},
      })),
    ]);
  };

  const deleteRow = (rowId) =>
    setRows((prev) => prev.filter((r) => r.id !== rowId));

  // ─────────────────────────────────────────────
  // Resize logic (kept same)
  // ─────────────────────────────────────────────

  const onResizeMouseDown = (e, colId) => {
    e.preventDefault();
    resizingCol.current = colId;
    setResizingColumnId(colId);
    startX.current = e.clientX;
    startWidth.current = columns.find((c) => c.id === colId).width;

    const onMove = (ev) => {
      const delta = ev.clientX - startX.current;
      setColumns((cols) =>
        cols.map((c) =>
          c.id === colId
            ? { ...c, width: Math.max(80, startWidth.current + delta) }
            : c,
        ),
      );
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setResizingColumnId(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ─────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────

  const handleConfirm = async ({ datasetName, datasetType }) => {
    setShowConfirm(false);
    setStatus("Saving…");

    const cleanData = rows
      .filter((r) =>
        Object.values(r.cells).some((v) => v !== "" && v !== undefined),
      )
      .map((r) => {
        const obj = {};
        columns.forEach((c) => {
          obj[c.name] = r.cells[c.id] ?? "";
        });
        return obj;
      });

    const result = await submitManualData({
      datasetName,
      datasetType,
      rows: cleanData,
    });

    if (result.success) {
      setStatus("✅ Dataset saved!");
      setTimeout(() => {
        onClose();
        setStatus("");
      }, 1500);
    } else {
      setStatus(`❌ ${result.message}`);
    }
  };

  const totalGridWidth =
    ROW_NUM_WIDTH + columns.reduce((s, c) => s + c.width, 0) + 44;

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return ReactDom.createPortal(
    <div className={darkMode ? "dark" : ""}>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-6 z-50 flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-midnight text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 dark:bg-slate-900">
          <div>
            <h2 className="font-bold text-lg">Edit Dataset</h2>
            <p className="text-sm text-slate-400">
              Add or edit rows below ·{" "}
              <span className="text-sky">double-click a header</span> to rename
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition"
          >
            <RxCross2 size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-200 bg-slate-100 dark:bg-slate-800">
          <button onClick={() => addRows(10)} className="btn-secondary">
            + Add Rows
          </button>
          <button onClick={addColumn} className="btn-secondary">
            + Add Column
          </button>

          <div className="ml-auto text-sm text-slate-400">
            {rows.length} rows · {columns.length} columns
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
          <table
            className="border-collapse"
            style={{ minWidth: totalGridWidth, tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: ROW_NUM_WIDTH }} />
              {columns.map((c) => (
                <col key={c.id} style={{ width: c.width }} />
              ))}
              <col style={{ width: 44 }} />
            </colgroup>

            {/* HEADERS */}
            <thead>
              <tr>
                <th className="sticky top-0 left-0 z-30 bg-slate-100 dark:bg-slate-800" />

                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-800 group"
                  >
                    <div className="flex items-center h-9 relative">
                      {/* Header Text */}
                      {editingHeader === col.id ? (
                        <input
                          ref={headerInputRef}
                          defaultValue={col.name}
                          autoFocus
                          onBlur={(e) => commitHeader(col.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              commitHeader(col.id, e.target.value);
                          }}
                          className="absolute inset-0 w-full text-center bg-white dark:bg-midnight"
                        />
                      ) : (
                        <span
                          onDoubleClick={() => setEditingHeader(col.id)}
                          className="flex-1 text-sm font-semibold text-center text-slate-700 dark:text-white truncate cursor-pointer"
                          title="Double-click to rename"
                        >
                          {col.name}
                        </span>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => deleteColumn(col.id)}
                        className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 text-red-400 rounded hover:bg-red-200 text-xs"
                      >
                        <RxCross2 size={18} />
                      </button>

                      {/* Resize */}
                      <div
                        onMouseDown={(e) => onResizeMouseDown(e, col.id)}
                        className={`
                            absolute right-0 top-0 h-full w-1 cursor-col-resize
                            transition-colors
                            hover:bg-sky
                            ${resizingColumnId === col.id ? "bg-sky" : ""}
                        `}
                      />
                    </div>
                  </th>
                ))}

                {/* Add column */}
                <th className="sticky top-0 z-20 w-11 bg-slate-100 dark:bg-slate-800">
                  <button
                    onClick={addColumn}
                    className="w-full h-9 text-slate-400 hover:text-sky"
                  >
                    +
                  </button>
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.id}>
                  <td
                    onContextMenu={(e) => {
                      e.preventDefault();
                      deleteRow(row.id);
                    }}
                    className="text-center text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 text-slate-400 sticky left-0"
                  >
                    {ri + 1}
                  </td>

                  {columns.map((col) => {
                    const isSel =
                      selectedCell?.rowId === row.id &&
                      selectedCell?.colId === col.id;

                    return (
                      <td
                        key={col.id}
                        onClick={() =>
                          setSelectedCell({
                            rowId: row.id,
                            colId: col.id,
                          })
                        }
                        className={`border border-slate-200 ${
                          ri % 2 === 0
                            ? "bg-white dark:bg-midnight"
                            : "bg-slate-50 dark:bg-slate-900"
                        } ${isSel && " outline-2 outline-sky"}`}
                      >
                        <input
                          value={row.cells[col.id] ?? ""}
                          onChange={(e) =>
                            handleCellChange(row.id, col.id, e.target.value)
                          }
                          className="w-full h-9 px-3 bg-transparent outline-none"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="bg-slate-100 dark:bg-slate-800"
                >
                  <button
                    onClick={() => addRows(10)}
                    className="w-full h-11 text-slate-400 hover:text-sky text-xs"
                  >
                    + Add 10 more rows
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 dark:bg-slate-900">
          <span className="text-sm text-sky">{status}</span>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-6 py-2 rounded-lg bg-sky text-white font-bold hover:opacity-90"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <SubmitModal
          columns={columns}
          rows={rows}
          darkMode={darkMode}
          onConfirm={handleConfirm}
          onBack={() => setShowConfirm(false)}
        />
      )}
    </div>,
    document.getElementById("portal"),
  );
};

export default Spreadsheet;
