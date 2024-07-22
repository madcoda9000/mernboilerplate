"use client"

import { AuditEntryPayload, newRolePayload } from "@/Interfaces/PayLoadINterfaces"
import LogsService from "@/Services/LogsService"
import UsersService from "@/Services/UsersService"
import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { Role, User } from "@/Interfaces/GlobalInterfaces"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { SettingsSidebar } from "@/components/Forms/SettingsSidebar"
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
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Icons } from "@/components/Icons"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import RolesService from "@/Services/RolesService"
import { rolesClomns } from "@/components/Utils/RolesColumnsDefinition"
import { DataTable } from "@/components/Utils/DataTable"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
 * Renders a component that displays a list of roles and allows creating new roles.
 *
 * @return {JSX.Element} The rendered component.
 */
const Roles = () => {
  const [data, setData] = useState<Role[]>([])
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const [newRoleDialogOpen, setnewRoleDialogOpen] = useState(false)
  const [newRoleName, setnewRoleName] = useState("")
  const [validateMsg, setValidateMsg] = useState("")
  const [btnDisabled, setBtnDisabled] = useState(true)
  type ToastType = "info" | "success" | "error"

  /**
   * Function to open the alert dialog.
   *
   * @return {void} This function does not return anything.
   */
  const openNewRoleDialog = () => {
    setnewRoleDialogOpen(true)
  }

  /**
   * Function to fetch roles data from the server, create an audit log entry,
   * and update the component state accordingly.
   *
   * @return {void} This function does not return anything.
   */
  useEffect(() => {
    const getData = () => {
      RolesService.getRoles(1, 90000, "").then((response) => {
        if (response && !response.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "info",
            message: "Viewed Roles",
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
   * Shows a toast message based on the type and message provided.
   *
   * @param {ToastType} typ - The type of the toast message (info, success, or error).
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

  /**
   * Saves a new role.
   *
   * @return {Promise<void>} Promise that resolves when the role is saved successfully.
   */
  const saveNewRole = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (newRoleName === "") {
      setValidateMsg("Please enter a role name")
    } else {
      const pl: newRolePayload = {
        roleName: newRoleName,
      }
      RolesService.createRole(pl).then((response) => {
        if (response && !response.data.error) {
          showToast("success", "Role created successfully")
          setnewRoleDialogOpen(false)
          setnewRoleName("")
          setValidateMsg("")
        } else {
          showToast("error", response.data.message)
        }
      })
    }
  }

  /**
   * Sets the value of `newRoleName` to the value of the input element.
   *
   * @param {type} e - The event object containing the input element.
   * @return {type} This function does not return a value.
   */
  const setTypedValue = (rName: string) => {
    if (rName === "") {
      setValidateMsg("Please enter a role name")
      setBtnDisabled(true)
    } else if (rName.toLowerCase() === "admins" || rName.toLowerCase() === "users") {
      setValidateMsg("The new name should not be admins or users!")
      setBtnDisabled(true)
    } else {
      setnewRoleName(rName)
      setBtnDisabled(false)
    }
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
        <AlertDialog open={newRoleDialogOpen} onOpenChange={setnewRoleDialogOpen}>
          <AlertDialogContent>
            <AlertDialogTrigger asChild>
              <button style={{ display: "none" }}></button>
            </AlertDialogTrigger>
            <AlertDialogHeader>
              <AlertDialogTitle>Create a new Role...</AlertDialogTitle>
              <AlertDialogDescription>
                Please enter a name for the new role. Please avoid names like admins or users!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-0 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-left">
                  Role Name:
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  onChange={(e) => setTypedValue(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-left"></div>
                <div className="col-span-3 pl-3">
                  {validateMsg && <p className="text-red-400">{validateMsg}&nbsp;</p>}
                </div>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={(e) => saveNewRole(e)} disabled={btnDisabled}>
                Save new role...
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {!isMobile ? (
          <>
            <div className="hidden space-y-6 pb-16 md:block">
              <div className="space-y-0.5">
                <div className="float-left w-[50%]"></div>
                <div className="float-right">
                  <Button variant="blue" onClick={() => openNewRoleDialog()}>
                    create new Role
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
                    <DataTable data={data} columns={rolesClomns} />
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
export default Roles
