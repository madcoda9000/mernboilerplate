import Link from "next/link"
import { ModeToggle } from "@/components/Utils/themeToggle"
import { ForgotPw2Form } from "@/components/Forms/ForgotPw2Form"

/**
 * Renders the Password Reset (Step 2) page with necessary components and links.
 *
 * @return {JSX.Element} The rendered JSX for the Password Reset (Step 2) page.
 */
const ForgotPw2 = () => {
  return (
    <>
      <div className="container relative h-[100vh]  flex-col items-center justify-center">
        <div className="lg:p-8 w-full h-[100%]">
          <div className="mx-auto flex w-full h-[100%] flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Password Reset (Step 2)</h1>
            </div>
            <ForgotPw2Form />
            <p className="pt-8 px-8 text-center text-sm text-muted-foreground">
              By clicking "Reset my password now!", you agree to our{" "}
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

export default ForgotPw2
