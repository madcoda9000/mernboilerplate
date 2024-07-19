"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/Utils/DataTableViewOptions"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

/**
 * Renders a toolbar for a data table with search input fields and a reset button.
 *
 * @template TData - The type of data in the table.
 * @param {DataTableToolbarProps<TData>} props - The props for the component.
 * @param {Table<TData>} props.table - The table instance.
 * @returns {JSX.Element} - The rendered toolbar.
 */
export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const availableColumns = table.getAllColumns().map((column) => column.id)
  const columns = [
    { id: "message", placeholder: "Search message..." },
    { id: "email", placeholder: "Search email..." },
    { id: "roleName", placeholder: "Search role..." },
  ]

  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex flex-1 items-center space-x-2">
        {columns.map(({ id, placeholder }) => {
          if (availableColumns.includes(id)) {
            const column = table.getColumn(id)
            return (
              column && (
                <Input
                  key={id}
                  placeholder={placeholder}
                  value={(column.getFilterValue() as string) ?? ""}
                  onChange={(event) => column.setFilterValue(event.target.value)}
                  className="h-8 w-[150px] lg:w-[250px]"
                />
              )
            )
          }
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
