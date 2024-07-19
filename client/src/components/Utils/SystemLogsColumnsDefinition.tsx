"use client"

import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/Utils/DataTableColumnHeader"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/Icons"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SystemLog = {
  _id: string
  timestamp: string
  level: string
  message: string
  hostname: string
  meta: object
}

/**
 * Defines the columns for displaying system logs in a table format.
 *
 * This type is used to define the shape of the data.
 *
 * @param {ColumnDef<SystemLog>[]} columns - Array of column definitions for the system logs table.
 */
export const columns: ColumnDef<SystemLog>[] = [
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
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const formatedDate = moment(new Date(row.getValue("timestamp"))).format("DD.MM.YYYY HH:mm:ss")
      return <div className="max-w-[160px] w-[160px]">{formatedDate}</div>
    },
    size: 160,
    maxSize: 160,
  },
  {
    accessorKey: "level",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Level" />,
    cell: ({ row }) => {
      if (row.getValue("level") === "info") {
        return (
          <div className="flex w-[60px] max-w-[60px]">
            <Icons.infoCircle className="text-blue" />
          </div>
        )
      } else if (row.getValue("level") === "warn") {
        return (
          <div className="flex w-[60px] max-w-[60px]">
            <Icons.exclamationTriangle className="text-warning" />
          </div>
        )
      } else if (row.getValue("level") === "error") {
        return (
          <div className="flex w-[60px] max-w-[60px]">
            <Icons.exclamationTriangle className="text-destructive" />
          </div>
        )
      } else if (row.getValue("level") === "http") {
        return (
          <div className="flex w-[60px] max-w-[60px]">
            <Icons.globe className="text-blue" />
          </div>
        )
      } else {
        return <div className="flex w-[60px] max-w-[60px]">{row.getValue("level")}</div>
      }
    },
    size: 60,
    maxSize: 60,
  },
  {
    accessorKey: "hostname",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Host" />,
    cell: ({ row }) => {
      return <div className="flex w-[140px] max-w-[140px]">{row.getValue("hostname")}</div>
    },
    size: 140,
    maxSize: 140,
  },
  {
    accessorKey: "message",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
    cell: ({ row }) => {
      return <div className="max-w-[100%] font-medium">{row.getValue("message")}</div>
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
