"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/components/Auth/AuthContext"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import LogsService from "@/Services/LogsService"
import { AuditEntryPayload, validateOtpPayload } from "@/Interfaces/PayLoadINterfaces"
import UsersService from "@/Services/UsersService"
import Otp from "@/components/ui/otp"
declare const window: {
  BASE_URL: string
} & Window
const apiurl = window.BASE_URL

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The MfaLoginForm component is a form to verify a user's OTP.
 * It features an input field for the user to enter the OTP.
 * It also features a button to submit the form data to verify the OTP.
 * If the OTP is valid, the user is granted access to the application.
 * If the OTP is invalid, an error message is displayed.
 * The form also features a button to cancel the OTP verification and return to the login page.
 * @param {{ className: string; [x: string]: any }} props - The component props.
 * @returns {JSX.Element} - The form component.
 */
export function MfaLoginForm({ className, ...props }: FormProps) {
  const { user, logout, refreshContext } = useAuthContext()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const [otpToken, setOtpToken] = React.useState<number>(0)
  const [errMsg, setErrMsg] = React.useState<string>("")
  const [succMsg, setSuccMsg] = React.useState<string>("")
  const [activatedSuccessfully, setActivatedSuccessfully] = React.useState<boolean>(false)

  /**
   * Handles the OTP verification process for a user attempting to log in.
   *
   * @param {React.SyntheticEvent} e - The event object from the form submission.
   *
   * This function performs the following:
   * 1. Prevents the default form submission behavior.
   * 2. Constructs a payload containing the user's ID and OTP token.
   * 3. Calls the `validateOtp` function from the `UsersService` to verify the OTP.
   * 4. If the OTP verification fails, sets an error message and creates a warning audit entry.
   * 5. If the OTP verification succeeds, requests a new access token, updates session storage,
   *    refreshes the context, and creates an informational audit entry.
   * 6. Navigates the user to the home page upon successful verification.
   */
  const verifyOtp = (e: React.SyntheticEvent) => {
    if (user) {
      e.preventDefault()
      setIsLoading(true)
      const payload: validateOtpPayload = {
        _id: user._id,
        token: "" + otpToken,
      }
      UsersService.validateOtp(payload).then((response) => {
        if (response.data.error) {
          setIsLoading(false)
          setErrMsg(response.data.message)
          const audpl: AuditEntryPayload = {
            user: user.userName,
            level: "warn",
            message: user.userName + " otp verification failed! " + response.data.message,
          }
          LogsService.createAuditEntry(audpl)
        } else {
          axios
            .get(apiurl + "/v1/auth/createNewAccessToken", {
              withCredentials: true,
            })
            .then((apiResponse) => {
              if (apiResponse.data.error === false) {
                sessionStorage.removeItem("user")
                sessionStorage.setItem("user", JSON.stringify(apiResponse.data.reqUser))
                refreshContext()
                setIsLoading(false)
                setErrMsg("")
                setActivatedSuccessfully(true)
                setSuccMsg(response.data.message)
                const payload: AuditEntryPayload = {
                  user: user.userName,
                  level: "info",
                  message: user.userName + " verified otp successfully!",
                }
                LogsService.createAuditEntry(payload)
                let mcount = 1
                const inv = setInterval(() => {
                  if (mcount > 0) {
                    mcount = mcount - 1
                  } else {
                    goHome(inv)
                  }
                }, 1000)
              } else if (apiResponse.data.error === true) {
                setErrMsg(apiResponse.data.message)
                setIsLoading(false)
              }
            })
        }
      })
    }
  }

  /**
   * Clears the given interval and navigates the user to the home page.
   *
   * @param {NodeJS.Timeout} intervalId - The interval ID to be cleared.
   */
  function goHome(intervalId: NodeJS.Timeout) {
    clearInterval(intervalId)
    navigate("/Home")
  }

  /**
   * Handles a change to the OTP input field
   *
   * @param {number} e - The new OTP value
   */
  const handleChange = (e: number) => {
    //console.log(e);
    setOtpToken(e)
  }

  /**
   * Cancels the MFA login process by logging the user out and navigating the user to the login page.
   *
   * @return {void}
   */
  const cancelMfaLogin = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className={cn("", className)} {...props}>
      <div className="grid gap-6">
        {errMsg && (
          <Alert className="mb-5" variant="destructive">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{errMsg}</AlertDescription>
          </Alert>
        )}
        {succMsg && (
          <Alert>
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            {succMsg}
          </Alert>
        )}
        <form onSubmit={verifyOtp}>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Otp length={6} otp={otpToken} onOtpChange={handleChange} />
            </div>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-5">
            <Button
              type="button"
              onClick={() => cancelMfaLogin()}
              variant={"outline"}
              style={{ display: activatedSuccessfully === false ? "block" : "none" }}
            >
              Cancel
            </Button>
            {activatedSuccessfully === true && (
              <Button type="button" onClick={() => navigate("/Home")}>
                {activatedSuccessfully && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                loading...
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || activatedSuccessfully}
              className="w-[100%]"
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
