"use client"

import { AuditEntryPayload, disableMfaPayload, userIdPayload } from "@/Interfaces/PayLoadINterfaces"
import LogsService from "@/Services/LogsService"
import UsersService from "@/Services/UsersService"
import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { User } from "@/Interfaces/GlobalInterfaces"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { SettingsSidebar } from "@/components/Forms/SettingsSidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
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
    /**
     * Fetches paginated user data from the UsersService and updates the
     * component state with the received data. If the response is not
     * successful, an empty array is set to the state.
     *
     * @return {Promise<void>} A promise that resolves when the data has been
     * fetched and the component state has been updated.
     */
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
   * Copies the provided value to the user's clipboard.
   *
   * @param {string} value - The value to be copied to the clipboard.
   * @return {Promise<void>} A promise that resolves when the value has been successfully copied to the clipboard.
   */
  const copyValueToClippBoard = async (value: string) => {
    try {
      let copyValue = ""

      if (!navigator.clipboard) {
        throw new Error("Browser don't have support for native clipboard.")
      }

      if (value) {
        copyValue = value
      }

      await navigator.clipboard.writeText(copyValue)
      showToast("success", "Value copied to clipboard successfully!")
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.toString())
      } else {
        console.log("An unknown error occurred.")
      }
    }
  }

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

  /**
   * Handles the account status of a user by locking or unlocking the account based on the user's accountLocked status.
   *
   * @param {User} user - The user object for which the account status is being handled.
   * @return {void}
   */
  const handleAccountStatus = (user: User) => {
    const pl: userIdPayload = {
      _id: user._id,
    }

    if (user.accountLocked) {
      UsersService.unlockUser(pl).then((response) => {
        if (response && !response.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "warn",
            message: `User account ${user.userName} successfully unlocked!`,
          }
          LogsService.createAuditEntry(adpl)
          showToast("success", `User account ${user.userName} unlocked!`)

          // Update the user in the data array
          setData((prevData) =>
            prevData.map((u) => (u._id === user._id ? { ...u, accountLocked: false } : u))
          )
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

          // Update the user in the data array
          setData((prevData) =>
            prevData.map((u) => (u._id === user._id ? { ...u, accountLocked: true } : u))
          )
        }
      })
    }
  }

  /**
   * Handles the MFA enforcement status of a user by setting the mfaenforcement property to true or false.
   *
   * @param {User} user - The user object for which the MFA enforcement status is being handled.
   * @return {void}
   */
  const handleMfaEnforcementStatus = (user: User) => {
    const pl: userIdPayload = {
      _id: user._id,
    }

    if (user.mfaEnforced) {
      UsersService.disableMfaEnforce(pl).then((response) => {
        if (response && !response.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "warn",
            message: `MFA enforcementfor user ${user.userName} disabled successfully!`,
          }
          LogsService.createAuditEntry(adpl)
          showToast("success", `MFA enforcement for user ${user.userName} disabled successfully!`)

          // Update the user in the data array
          setData((prevData) =>
            prevData.map((u) => (u._id === user._id ? { ...u, mfaEnforced: false } : u))
          )
        }
      })
    } else {
      UsersService.enableMfaEnforce(pl).then((response) => {
        if (response && !response.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "warn",
            message: `MFA enforcement for user ${user.userName} enabled successfully!`,
          }
          LogsService.createAuditEntry(adpl)
          showToast("success", `MFA enforcement for user ${user.userName} enabled successfully!`)

          // Update the user in the data array
          setData((prevData) =>
            prevData.map((u) => (u._id === user._id ? { ...u, mfaEnforced: true } : u))
          )
        }
      })
    }
  }

  const handleMfaDisable = (user: User) => {
    const pl: disableMfaPayload = {
      execUserId: JSON.parse(sessionStorage.getItem("user")!)._id,
      _id: user._id,
    }

    UsersService.disableMfa(pl).then((response) => {
      if (response && !response.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "warn",
          message: `MFA for user ${user.userName} disabled successfully!`,
        }
        LogsService.createAuditEntry(adpl)
        showToast("success", `MFA for for user ${user.userName} disabled successfully!`)

        // Update the user in the data array
        setData((prevData) =>
          prevData.map((u) => (u._id === user._id ? { ...u, mfaEnabled: false } : u))
        )
      }
    })
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
                    <DataTable
                      data={data}
                      columns={usersClomns({
                        handleAccountStatus,
                        handleMfaEnforcementStatus,
                        handleMfaDisable,
                        copyValueToClippBoard,
                      })}
                    />
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
