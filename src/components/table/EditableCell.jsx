import React, { useEffect, useState } from 'react'

const EditableCell = ({ getValue, row, column, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue)

    const onBlur = () => {
        table.options.meta?.updateData(
            row.index,
            column.id,
            value
        )
    }

    useEffect(() => { setValue(initialValue) }, [initialValue])

    return (
        <input
            value={value}
            onChange={
                e => setValue(e.target.value)
            }
            onBlur={onBlur}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.target.blur()
                }
            }}
            className="w-full
            px-3 py-2
            rounded-md
            outline-none
            focus:ring-1
           dark:focus:ring-sky
           focus:ring-gray-950"
        />
    )
}

export default EditableCell