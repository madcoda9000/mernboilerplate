"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/Utils/DataTableColumnHeader"
import { Icons } from "@/components/Icons"
import { User } from "@/Interfaces/GlobalInterfaces"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Checkbox } from "../../components/ui/checkbox"
import { Switch } from "../ui/switch"

type ToastType = "info" | "success" | "error"

/**
 * Redirects to the specified target.
 *
 * @param {string} target - The target URL to redirect to
 * @return {void}
 */
const makeRedirect = (target: string) => {
  window.location.href = target
}

/**
 * Shows a toast message based on the type and message provided.
 *
 * @param {ToastType} typ - The type of the toast message (info, success, or error).
 * @param {string} message - The message content to be displayed in the toast.
 */
const showToast = (typ: ToastType, message: string) => {
  const date = new Date()
  const description = `${date.toLocaleDateString("en-EN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })} at ${date.toLocaleTimeString("en-EN", { hour: "2-digit", minute: "2-digit" })}`

  const toastMap = {
    info: toast.info,
    success: toast.success,
    error: toast.error,
  }

  toastMap[typ]?.(message, { description })
}

/**
 * Defines the columns for displaying users in a table format.
 *
 * This function returns an array of column definitions for the users table.
 * Each column definition specifies the accessor key, header, cell, size, and maxSize
 * properties for each column.
 *
 * @param {Object} handlers - An object containing the following handler functions:
 *   - handleAccountStatus: A function that handles the account status change.
 *   - handleMfaEnforcementStatus: A function that handles the MFA enforcement status change.
 *   - handleMfaDisable: A function that handles the MFA disable action.
 * @return {Array} An array of column definitions for the users table.
 */
export const usersClomns = ({
  handleAccountStatus,
  handleMfaEnforcementStatus,
  handleMfaDisable,
  copyValueToClippBoard,
}: {
  handleAccountStatus: (user: User) => void
  handleMfaEnforcementStatus: (user: User) => void
  handleMfaDisable: (user: User) => void
  copyValueToClippBoard: (value: string) => void
}): ColumnDef<User>[] => [
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
  },
  {
    accessorKey: "accountLocked",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ACC" className="max-w-[30px] w-[30px]" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[30px] w-[30px]">
          {row.original.userName === "super.admin" ? (
            <>
              <Tooltip>
                <TooltipTrigger>
                  <Switch checked={true} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>super.admin cannot be deactivated!</p>
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              {row.original.accountLocked ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Switch
                      checked={false}
                      onCheckedChange={() => handleAccountStatus(row.original)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Activate account</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <Switch
                      checked={true}
                      onCheckedChange={() => handleAccountStatus(row.original)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deactivate account</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </>
          )}
        </div>
      )
    },
    size: 30,
    maxSize: 30,
  },
  {
    accessorKey: "mfaEnabled",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MFA" className="max-w-[30px] w-[30px]" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[30px] max-w-[30px]">
          {row.original.mfaEnabled ? (
            <Tooltip>
              <TooltipTrigger>
                <Switch checked={true} onCheckedChange={() => handleMfaDisable(row.original)} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Disable 2FA Authentication</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Switch checked={false} disabled={true} />
          )}
        </div>
      )
    },
    size: 30,
    maxSize: 30,
  },
  {
    accessorKey: "mfaEnforced",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MfaEnf" className="max-w-[30px] w-[30px]" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[30px] max-w-[30px]">
          {row.original.mfaEnforced ? (
            <Tooltip>
              <TooltipTrigger>
                <Switch
                  checked={true}
                  onCheckedChange={() => handleMfaEnforcementStatus(row.original)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to disable 2FA enforcement.</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <Switch
                  checked={false}
                  onCheckedChange={() => handleMfaEnforcementStatus(row.original)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to enforce 2FA Authentication</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )
    },
    size: 30,
    maxSize: 30,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email Address" />,
    cell: ({ row }) => {
      return <div className="flex w-[150px] max-w-[150px]">{row.getValue("email")?.toString()}</div>
    },
    size: 150,
    maxSize: 150,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => {
      return (
        <div className="flex w-[300px] max-w-[300px]">{row.getValue("userName")?.toString()}</div>
      )
    },
    size: 300,
    maxSize: 300,
  },
  {
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" className="max-w-[30px] w-[30px]" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[30px] max-w-[30px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">...</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {row.original.firstName}&nbsp;{row.original.lastName}
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => copyValueToClippBoard(row.original._id)}
              >
                <Icons.clipboardCopy className="inline mr-3" />
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => copyValueToClippBoard(row.original.userName)}
              >
                <Icons.clipboardCopy className="inline mr-3" />
                Copy user name
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  makeRedirect("/Admin/EditUser/" + row.original._id)
                }}
              >
                <Icons.pencil className="inline mr-3" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => makeRedirect("/Admin/delUser/" + row.original._id)}
                disabled={row.original.userName === "super.admin"}
              >
                <Icons.circleCross className="inline mr-3" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    size: 30,
    maxSize: 30,
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
