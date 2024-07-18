import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { useState } from "react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { NewUserForm } from "@/components/Forms/NewUserForm"
import { Separator } from "@/components/ui/separator"

const NewUser = () => {
  const [isLoading, SetIsLoading] = useState<boolean>(false)

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
            <h2 className="text-2xl font-bold tracking-tight">Create a new User</h2>
            <p className="text-muted-foreground">Please fill in all mandatory fields.</p>
          </div>
          <Separator className="my-6" />
          <NewUserForm />
        </div>
      </>
    )
  }
}

export default NewUser
