"use client"

import { AuditEntryPayload } from "@/Interfaces/PayLoadINterfaces"
import LogsService from "@/Services/LogsService"
import UsersService from "@/Services/UsersService"
import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { User } from "@/Interfaces/GlobalInterfaces"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { SettingsSidebar } from "@/components/Forms/SettingsSidebar"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Icons } from "@/components/Icons"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DataTable } from "@/components/Utils/DataTable"
import { usersClomns } from "@/components/Utils/UsersColumsDefinition"

// sidebar nav items
const sidebarNavItems = [
  {
    title: "Users",
    href: "/Admin/Users",
  },
  {
    title: "Roles",
    href: "/Admin/Roles",
  },
]

/**
 * Renders the Users component which fetches data from the UsersService and displays it in a DataTable.
 *
 * @return {JSX.Element} The rendered Users component.
 */
const Users = () => {
  const [data, setData] = useState<User[]>([])
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  type ToastType = "info" | "success" | "error"

  useEffect(() => {
    const getData = () => {
      UsersService.getUsersPaginated(1, 90000, "").then((response) => {
        if (response && !response.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "info",
            message: "Viewed Users",
          }
          LogsService.createAuditEntry(adpl)
          setData(response.data.paginatedResult.docs)
          SetIsLoading(false)
        } else {
          setData([])
          SetIsLoading(false)
        }
      })
    }

    getData()
  }, [])

  /**
   * Displays a toast message with the specified type and message.
   *
   * @param {ToastType} typ - The type of toast message (info, success, or error).
   * @param {string} message - The message content to be displayed in the toast.
   * @return {void}
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

  if (isLoading) {
    return (
      <>
        <MfaChecker />
        <RoleChecker requiredRole="admins" />
        <div className="flex justify-center w-[100%] mt-10">
          <LoadingSpinner />
        </div>
      </>
    )
  } else {
    return (
      <>
        <MfaChecker />
        <RoleChecker requiredRole="admins" />
        {!isMobile ? (
          <>
            <div className="hidden space-y-6 pb-16 md:block">
              <div className="space-y-0.5">
                <div className="float-left w-[50%]"></div>
                <div className="float-right">
                  <Button variant="blue" onClick={() => navigate("/Admin/NewUser")}>
                    create new User
                  </Button>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

                <p className="text-muted-foreground">
                  Manage preferences that affect different scopes of this application.
                </p>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-10 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5 border-r">
                  <SettingsSidebar items={sidebarNavItems} className="pr-5" />
                </aside>
                <div className="flex-1 ">
                  {isLoading ? (
                    <>
                      <div className="flex justify-center w-[100%] mt-10">
                        <LoadingSpinner />
                      </div>
                    </>
                  ) : (
                    <DataTable data={data} columns={usersClomns} />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <span>Mobile view!</span>
          </>
        )}
      </>
    )
  }
}
export default Users
