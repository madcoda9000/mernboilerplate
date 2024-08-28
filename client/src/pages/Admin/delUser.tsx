import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useParams } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle, alertVariants } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { User } from "@/Interfaces/GlobalInterfaces"
import UsersService from "@/Services/UsersService"
import { AuditEntryPayload, userIdPayload } from "@/Interfaces/PayLoadINterfaces"
import LogsService from "@/Services/LogsService"
import { useNavigate } from "react-router-dom"
import { type VariantProps } from "class-variance-authority"

// Hole den Typ der Varianten aus den alertVariants
type AlertVariantType = NonNullable<VariantProps<typeof alertVariants>["variant"]>

/**
 * Renders the Edit User page based on the user's loading status.
 *
 * @return {JSX.Element} The JSX elements representing the Edit User page.
 */
const DelUser = () => {
  const [isLoading, SetIsLoading] = useState<boolean>(false)
  const { userId } = useParams()
  const [currUser, setCurrUser] = useState<User | null>(null)
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [errMsgType, setErrMsgType] = useState<AlertVariantType>("destructive")
  const nav = useNavigate()

  /**
   * Redirects to the specified target.
   *
   * @param {string} target - The target URL to redirect to
   * @return {void}
   */
  const makeRedirect = (target: string) => {
    nav(target)
  }

  useEffect(() => {
    /**
     * Fetches user data from the UsersService and sets state variables accordingly.
     *
     * Sets the current user to the fetched user data and sets the loading state to false.
     *
     * If an error occurs during the fetch, sets the error message state to the error message returned by the server.
     *
     * @return {Promise<void>} - A Promise that resolves when the user data has been fetched and state variables have been updated.
     */
    const fetchUser = async () => {
      SetIsLoading(true)
      const res = await UsersService.getUser(userId !== undefined ? userId : "")
      if (!res.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "info",
          message: "User deletion process initiated",
        }
        LogsService.createAuditEntry(adpl)
        setCurrUser(res.data.user)
        SetIsLoading(false)
      } else {
        setErrMsg(res.data.message)
      }
    }

    fetchUser()
  }, [])

  /**
   * Cancels the user deletion process.
   *
   * Writes an audit entry and redirects to the users page.
   *
   * @return {void}
   */
  const cancelDeletion = () => {
    const adpl: AuditEntryPayload = {
      user: JSON.parse(sessionStorage.getItem("user")!).userName,
      level: "info",
      message: "User deletion process aborted",
    }
    LogsService.createAuditEntry(adpl)
    makeRedirect("/admin/users")
  }

  /**
   * Deletes a user from the system and logs the action.
   *
   * @return {Promise<void>} - A Promise that resolves when the deletion is complete.
   */
  const deleteUser = async () => {
    const pl: userIdPayload = {
      _id: userId,
    }
    const res = await UsersService.deleteUser(pl)
    if (!res.data.error) {
      const adpl: AuditEntryPayload = {
        user: JSON.parse(sessionStorage.getItem("user")!).userName,
        level: "info",
        message: "User deleted successfully",
      }
      LogsService.createAuditEntry(adpl)
      setErrMsgType("success")
      setErrMsg("User deleted successfully"!)
      setTimeout(function () {
        makeRedirect("/admin/users")
      }, 2000)
    } else {
      setErrMsg(res.data.message)
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
        <RoleChecker requiredRole="admins" />
        <MfaChecker />
        <div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Delete User (Id: {userId})</h2>
          </div>
          <Separator className="my-6" />
          <Alert className="mb-5 w-[40%]" variant={errMsgType}>
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>NOTE!</AlertTitle>
            <AlertDescription>
              <div>
                {errMsg !== null
                  ? errMsg
                  : `Are you sure you want to delete user ${currUser?.userName}? This action cannot be undone!`}
              </div>
            </AlertDescription>
          </Alert>
          <Button variant={"outline"} className="mr-5 mt-5" onClick={() => cancelDeletion()}>
            No, cancel please..
          </Button>
          <Button className="mt-5" disabled={errMsg !== null} onClick={() => deleteUser()}>
            Yes, Delete this User!
          </Button>
        </div>
      </>
    )
  }
}

export default DelUser
