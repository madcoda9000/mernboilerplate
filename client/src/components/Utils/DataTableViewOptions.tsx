"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Role, User } from "@/Interfaces/GlobalInterfaces"
import { AuditEntryPayload, userIdPayload } from "@/Interfaces/PayLoadINterfaces"
import UsersService from "@/Services/UsersService"
import LogsService from "@/Services/LogsService"
import { toast } from "sonner"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

type ToastType = "info" | "success" | "error"

/**
 * Renders a dropdown menu for toggling the visibility of columns in a data table.
 *
 * @param {DataTableViewOptionsProps<TData>} props - The component props.
 * @param {Table<TData>} props.table - The data table object.
 * @return {JSX.Element} The rendered dropdown menu component.
 */
export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  const [userAlertOpen, setUserAlertOpen] = useState(false)
  const [roleAlertOpen, setRoleAlertOpen] = useState(false)

  // Type Guard für User
  function isUser(data: any): data is User {
    return "userName" in data
  }

  // Type Guard für Role
  function isRole(data: any): data is Role {
    return "roleName" in data
  }

  /**
   * Function to open the alert dialog.
   *
   * @return {void} This function does not return anything.
   */
  const openUserDeletionAlertDialog = () => {
    setUserAlertOpen(true)
  }

  /**
   * Function to open the alert dialog.
   *
   * @return {void} This function does not return anything.
   */
  const openRolesDeletionAlertDialog = () => {
    setRoleAlertOpen(true)
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
   * Deletes a user from the system and logs the action.
   *
   * @param {User} user - The user to be deleted
   * @return {void}
   */
  const deleteUser = (user: User) => {
    if (user.userName === "super.admin") {
      openUserDeletionAlertDialog()
    } else {
      const upl: userIdPayload = {
        _id: user._id,
      }
      UsersService.deleteUser(upl).then((response) => {
        if (response && !response.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "warn",
            message: `Deleted User ${user.userName}`,
          }
          LogsService.createAuditEntry(adpl)
          showToast("success", "User deleted successfully")
        } else {
          showToast("error", response.data.message)
        }
      })
    }
  }

  // Check if any row contains a user with userName: "super.admin"
  const hasSuperAdmin = table.getFilteredSelectedRowModel().rows.some((row) => {
    const data = row.original
    if (isUser(data)) {
      return data.userName === "super.admin"
    }
    return false
  })

  // Check if any row contains a role with roleName: "admin" or "user"
  const hasAdminsOrUsersRole = table.getFilteredSelectedRowModel().rows.some((row) => {
    const data = row.original
    if (isRole(data)) {
      return data.roleName === "admins" || data.roleName === "users"
    }
    return false
  })

  /**
   * Executes the selected action for each row in the table that is currently selected.
   * If the row has a roleName property, it logs a message indicating that it is being deleted.
   * If the row has a userName property, it logs a message indicating that it is being deleted.
   *
   * @return {void} This function does not return anything.
   */
  const doSelectedAction = () => {
    if (table.getFilteredSelectedRowModel().rows.length !== 0) {
      const rows = table.getFilteredSelectedRowModel().rows

      // check if we have users or roles
      if (isUser(rows[0].original)) {
        if (hasSuperAdmin) {
          openUserDeletionAlertDialog()
        } else {
          rows.map((row) => {
            const data = row.original as User
            deleteUser(data)
          })
        }
      } else if (isRole(rows[0].original)) {
        if (hasAdminsOrUsersRole) {
          openRolesDeletionAlertDialog()
        } else {
          rows.map((row) => {
            const data = row.original as Role
            console.log("deleting: " + data.roleName)
          })
        }
      }
    }
  }

  return (
    <>
      <AlertDialog open={userAlertOpen} onOpenChange={setUserAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTrigger asChild>
            <button style={{ display: "none" }}></button>
          </AlertDialogTrigger>
          <AlertDialogHeader>
            <AlertDialogTitle>User deletion aborted!</AlertDialogTitle>
            <AlertDialogDescription>
              The user account super.admin cannot be deleted! Please exclude it from your selection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ok</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={roleAlertOpen} onOpenChange={setRoleAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTrigger asChild>
            <button style={{ display: "none" }}></button>
          </AlertDialogTrigger>
          <AlertDialogHeader>
            <AlertDialogTitle>Roles deletion aborted!</AlertDialogTitle>
            <AlertDialogDescription>
              The roles admins & users cannot be deleted! Please exclude them from your selection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ok</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {table.getFilteredSelectedRowModel().rows.length !== 0 && (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="ml-auto mr-3">
                Delete selected Rows!
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the selected items and
                  remove them from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={doSelectedAction}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
