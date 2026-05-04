import React, { useState } from "react";
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";

import DATA from "../../data";
import EditableCell from "./EditableCell";
import RoundButton from "../RoundButton"



const DataTable = () => {
    const [data, setData] = useState(DATA);

    const [columns, setColumns] = useState([
        { accessorKey: "country", header: "Country", cell: EditableCell },
        { accessorKey: "value1", header: "Value 1", cell: EditableCell },
        { accessorKey: "value2", header: "Value 2", cell: EditableCell },
        { accessorKey: "value3", header: "Value 3", cell: EditableCell },

        {
            id: "addColumn",
            size: 150,
            enableResizing: false,
            header: () => (
                <RoundButton onClick={addColumn} className="bg-sky text-white">
                    Add Column
                </RoundButton>
            ),
            cell: () => null
        }
    ]);

    const addColumn = () => {
        const columnId = `value${columns.length}`;

        const newColumn = {
            accessorKey: columnId,
            header: `Value ${columns.length}`,
            cell: EditableCell,
        };

        setColumns(prev => {
            const cols = [...prev];
            cols.splice(cols.length - 1, 0, newColumn); // insert before add column button
            return cols;
        });

        setData(prev =>
            prev.map(row => ({
                ...row,
                [columnId]: ""
            }))
        );
    };

    const addRow = () => {
        const newRow = {};

        columns.forEach(col => {
            newRow[col.accessorKey] = "";
        });

        setData(prev => [...prev, newRow]);
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        meta: {
            updateData: (rowIndex, columnId, value) =>
                setData((prev) =>
                    prev.map((row, index) =>
                        index === rowIndex
                            ? {
                                ...prev[rowIndex],
                                [columnId]: value
                            }
                            : row
                    )
                ),
        }
    });
    return (
        // TABLE
        <div className="p-20">
            <table style={{ width: table.getTotalSize() }}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} style={{ width: header.getSize() }} className="relative text-nowrap px-4 py-3 text-lg font-semibold border items-center justify-center bg-white dark:bg-midnight">
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    <div
                                        onMouseDown={header.getResizeHandler()}
                                        onTouchStart={header.getResizeHandler()}
                                        className={`absolute -right-1 z-50 top-0 rounded-full h-full w-1.5 cursor-col-resize bg-sky opacity-0 hover:opacity-100 select-none touch-none ${header.column.getIsResizing() ? "bg-sky-400 opacity-100" : ""}`}
                                    />

                                </th>
                            ))}

                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-white dark:hover:bg-midnight relative">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} style={{ width: cell.column.getSize() }} className="px-4 py-3 border truncate">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            <div

                                className={`absolute -left-10 translate-y-1/2 rounded-full aspect-square w-8 cursor-pointer bg-sky select-none touch-none `}
                            />
                        </tr>
                    ))}
                    {/* Add Row Button */}
                    <tr>
                        <td colSpan={columns.length} className="text-center p-4">
                            <RoundButton onClick={addRow} className="bg-sky text-white font-bold">
                                Add Row
                            </RoundButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    );
};

export default DataTable;