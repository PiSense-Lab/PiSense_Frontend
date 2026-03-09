import React, { useState } from "react";
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";

import DATA from "../data";

const columns = [
    { accessorKey: "country", header: "Country", size: 200 },
    { accessorKey: "value1", header: "Value 1", size: 200 },
    { accessorKey: "value2", header: "Value 2", size: 200 },
    { accessorKey: "value3", header: "Value 3", size: 200 },
];

const DataTable = () => {
    const [data] = useState(DATA);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        defaultColumn: {
            minSize: 80,
            maxSize: 600,
        },
    });

    return (
        <div className="overflow-auto ">

            {/* HEADER */}
            <div className="sticky top-0 z-10 overflow-hidden text-nowrap">

                {table.getHeaderGroups().map(headerGroup => (
                    <div key={headerGroup.id} className="flex">

                        {headerGroup.headers.map(header => (
                            <div
                                key={header.id}
                                style={{ width: header.getSize() }}
                                className="relative px-4 py-3 text-lg font-semibold border-r flex items-center justify-center bg-white dark:bg-midnight"
                            >

                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}

                                {/* resize handle */}
                                <div
                                    onMouseDown={header.getResizeHandler()}
                                    onTouchStart={header.getResizeHandler()}
                                    className={`absolute -right-1 z-10 top-0 rounded-full h-full w-1.5 cursor-col-resize bg-sky opacity-0 hover:opacity-100 select-none touch-none ${header.column.getIsResizing() ? "bg-sky-400 opacity-100" : ""}`}
                                />

                            </div>
                        ))}

                    </div>
                ))}

            </div>

            {/* BODY */}
            <div>

                {table.getRowModel().rows.map(row => (
                    <div
                        key={row.id}
                        className="flex hover:bg-gray-100 dark:hover:bg-pitch "
                    >

                        {row.getVisibleCells().map(cell => (
                            <div
                                key={cell.id}
                                style={{ width: cell.column.getSize() }}
                                className="px-4 py-3 border-r border-b flex items-center truncate "
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </div>
                        ))}

                    </div>
                ))}

            </div>

        </div>
    );
};

export default DataTable;