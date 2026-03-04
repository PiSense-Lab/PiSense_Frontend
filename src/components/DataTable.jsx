import React, { useState } from "react";
import { getCoreRowModel, useReactTable, flexRender, } from "@tanstack/react-table";
import DATA from "../data"

const columns = [
    {
        accessorKey: "country",
        header: "Country",
        cell: (props) => <p>{props.getValue()}</p>,
    },
    {
        accessorKey: "value1",
        header: "Value 1",
        cell: (props) => <p>{props.getValue()}</p>,
    },
    {
        accessorKey: "value2",
        header: "Value 2",
        cell: (props) => <p>{props.getValue()}</p>,
    },
    {
        accessorKey: "value3",
        header: "Value 3",
        cell: (props) => <p>{props.getValue()}</p>,
    },
];

const DataTable = () => {
    const [data, setData] = useState(DATA);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full overflow-x-auto rounded-md">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-white dark:bg-midnight">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-3 text-left font-semibold "
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-gray-100 dark:bg-pitch">
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="hover:bg-gray-200 dark:hover:bg-midnight"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-3 "
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
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
