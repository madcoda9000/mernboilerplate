import Link from "next/link"
import { ModeToggle } from "@/components/Utils/themeToggle"
import { MfaSetupForm } from "@/components/Forms/MfaSetupForm"

/**
 * Renders the 2FA Verification page with the MfaSetupForm component and agreement links.
 *
 * @return {JSX.Element} The rendered JSX for the 2FA Verification page.
 */
const MfaSetup = () => {
  return (
    <>
      <div className="container relative h-[100vh]  flex-col items-center justify-center">
        <div className="lg:p-8 w-full h-[100%]">
          <div className="mx-auto flex w-full h-[100%] flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">2fa Verification</h1>
            </div>
            <MfaSetupForm />
            <p className="pt-8 px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="px-8 text-center text-sm text-muted-foreground">
              <ModeToggle />
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MfaSetup
