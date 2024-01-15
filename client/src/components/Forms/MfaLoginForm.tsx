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

export function MfaLoginForm({ className, ...props }: FormProps) {
  const { user, logout, refreshContext } = useAuthContext()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const [otpToken, setOtpToken] = React.useState<number>(0)
  const [errMsg, setErrMsg] = React.useState<string>("")
  const [succMsg, setSuccMsg] = React.useState<string>("")
  const [activatedSuccessfully, setActivatedSuccessfully] = React.useState<boolean>(false)

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

  function goHome(intervalId: NodeJS.Timeout) {
    clearInterval(intervalId)
    navigate("/Home")
  }

  const handleChange = (e: number) => {
    //console.log(e);
    setOtpToken(e)
  }

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
