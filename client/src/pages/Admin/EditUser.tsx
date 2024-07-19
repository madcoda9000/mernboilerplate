import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { useState } from "react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useParams } from "react-router-dom"
import { EditUserForm } from "@/components/Forms/EditUserForm"
import { Separator } from "@/components/ui/separator"

/**
 * Renders the Edit User page based on the user's loading status.
 *
 * @return {JSX.Element} The JSX elements representing the Edit User page.
 */
const EditUser = () => {
  const [isLoading, SetIsLoading] = useState<boolean>(false)
  const { userId } = useParams()

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
            <h2 className="text-2xl font-bold tracking-tight">Edit User (Id: {userId})</h2>
            <p className="text-muted-foreground">
              <b>Note: </b> If you don't want to change the users password, simply leave the field
              empty!
            </p>
          </div>
          <Separator className="my-6" />
          <EditUserForm />
        </div>
      </>
    )
  }
}

export default EditUser
