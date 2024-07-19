import Link from "next/link"
import { ModeToggle } from "@/components/Utils/themeToggle"
import { MfaLoginForm } from "@/components/Forms/MfaLoginForm"

/**
 * Renders the 2FA Verification page with the MfaLoginForm component and agreement links.
 *
 * @return {JSX.Element} The rendered JSX for the 2FA Verification page.
 */
const MfaLogin = () => {
  return (
    <>
      <div className="container relative h-[100vh]  flex-col items-center justify-center">
        <div className="lg:p-8 w-full h-[100%]">
          <div className="mx-auto flex w-full h-[100%] flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">2fa Verification</h1>
              <p className="text-sm text-muted-foreground">
                As 2FA authentication is enabled for your account, please provide a valid OTP token.
              </p>
            </div>
            <MfaLoginForm />
            <p className="pt-8 px-8 text-center text-sm text-muted-foreground">
              By clicking "Verify Code", you agree to our{" "}
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

export default MfaLogin
