"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/Utils/DataTableColumnHeader"
import { Role } from "@/Interfaces/GlobalInterfaces"

/**
 * Defines the columns for displaying roles in a table format.
 *
 * @param {ColumnDef<Role>[]} rolesClomns - Array of column definitions for the roles table.
 */
export const rolesClomns: ColumnDef<Role>[] = [
  /*
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },*/
  {
    accessorKey: "_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
    cell: ({ row }) => {
      return <div className="max-w-[130px] w-[130px]">{row.getValue("_id")}</div>
    },
    size: 130,
    maxSize: 160,
  },
  {
    accessorKey: "roleName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <div className="flex w-[400px]">{row.getValue("roleName")}</div>
    },
  } /*
  {
    id: "actions",
    cell: ({ row }) => {
      const logEntry = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(logEntry._id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },*/,
]
