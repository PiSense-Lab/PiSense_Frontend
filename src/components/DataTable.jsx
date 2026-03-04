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
        <div className="w-full overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2 text-sm">
                <thead className="bg-white dark:bg-midnight">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-3 first:rounded-l-md last:rounded-r-md text-center text-lg font-semibold border border-gray-200 dark:border-gray-700 "
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

                <tbody className="">
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="hover:bg-gray-100 dark:hover:bg-pitch bg-white dark:bg-midnight/50 dark:hover:text-sky"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-3 border border-r first:rounded-l-md last:rounded-r-md last:border-r-0 border-gray-200 dark:border-gray-700 dark:border "
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
