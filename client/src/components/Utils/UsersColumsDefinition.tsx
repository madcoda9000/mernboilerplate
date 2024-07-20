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
import LogsService from "@/Services/LogsService"
import { AuditEntryPayload, userIdPayload } from "@/Interfaces/PayLoadINterfaces"
import UsersService from "@/Services/UsersService"
import { Checkbox } from "../../components/ui/checkbox"

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

const handleMfaEnforcement = (user: User) => {
  const pl: userIdPayload = {
    _id: user._id,
  }
  if (user.mfaEnforced === true) {
    UsersService.disableMfaEnforce(pl).then((response) => {
      if (response && !response.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "info",
          message: `MFA Enforcement disabled for ${user.userName}`,
        }
        LogsService.createAuditEntry(adpl)
        showToast("success", `MFA Enforcement disabled for ${user.userName}`)
      }
    })
  } else {
    UsersService.enableMfaEnforce(pl).then((response) => {
      if (response && !response.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "info",
          message: `MFA Enforcement enabled for ${user.userName}`,
        }
        LogsService.createAuditEntry(adpl)
        showToast("success", `MFA Enforcement enabled for ${user.userName}`)
      }
    })
  }
}

/**
 * Handles the account status of a user by locking or unlocking the account based on the user's accountLocked status.
 *
 * @param {User} user - The user object for which the account status is being handled.
 */
const handleAccountStatus = (user: User) => {
  const pl: userIdPayload = {
    _id: user._id,
  }
  if (user.accountLocked === true) {
    UsersService.unlockUser(pl).then((response) => {
      if (response && !response.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "warn",
          message: `User account ${user.userName} successfully unlocked!`,
        }
        LogsService.createAuditEntry(adpl)
        showToast("success", `User account ${user.userName} unlocked!`)
      }
    })
  } else {
    UsersService.lockUser(pl).then((response) => {
      if (response && !response.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "warn",
          message: `User account ${user.userName} successfully locked!`,
        }
        LogsService.createAuditEntry(adpl)
        showToast("success", `User account ${user.userName} locked!`)
      }
    })
  }
}

export const usersClomns: ColumnDef<User>[] = [
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
          {row.original.accountLocked ? (
            <Tooltip>
              <TooltipTrigger>
                <Icons.circleCross
                  className="inline mr-3 text-destructive cursor-pointer"
                  title="activate account"
                  onClick={() => handleAccountStatus(row.original)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate account</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <Icons.circleCheck
                  className="inline mr-3 text-success cursor-pointer"
                  title="activate account"
                  onClick={() => handleAccountStatus(row.original)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate account</p>
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
                <Icons.circleCheck
                  className="inline mr-3 text-success cursor-pointer"
                  title="Disable 2FA Authentication"
                  onClick={() => showToast("info", "2FA Authenticationt disabled")}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Disable 2FA Authentication</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Icons.circleCross className="inline mr-3 text-destructive" title="2FA Auth disabled" />
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
                <Icons.circleCheck
                  className="inline mr-3 text-warning cursor-pointer"
                  title="2FA Authentication enforced"
                  onClick={() => handleMfaEnforcement(row.original)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to disable 2FA enforcement.</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <Icons.circleCross
                  className="inline mr-3 text-default cursor-pointer"
                  title="Click to enforce 2FA Authentication"
                  onClick={() => handleMfaEnforcement(row.original)}
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
                onClick={() => navigator.clipboard.writeText(row.original.userName)}
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
              <DropdownMenuItem className="cursor-pointer">
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
