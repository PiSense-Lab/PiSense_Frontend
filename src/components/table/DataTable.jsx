import React, { useState } from "react";
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";

import DATA from "../../data";
import EditableCell from "./EditableCell";

const columns = [
    { accessorKey: "country", header: "Country", cell: EditableCell },
    { accessorKey: "value1", header: "Value 1", cell: EditableCell },
    { accessorKey: "value2", header: "Value 2", cell: EditableCell },
    { accessorKey: "value3", header: "Value 3", cell: EditableCell },
];

const DataTable = () => {
    const [data, setData] = useState(DATA);
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
    console.log(data);
    return (
        // TABLE
        <div className="p-20">
            <table style={{ width: table.getTotalSize() }}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} style={{ width: header.getSize() }} className=" text-nowrap px-4 py-3 text-lg font-semibold border items-center justify-center bg-white dark:bg-midnight">
                                    {header.column.columnDef.header}
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
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} style={{ width: cell.column.getSize() }} className="px-4 py-3 border truncate">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default DataTable;