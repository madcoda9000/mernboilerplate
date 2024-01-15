"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthContext } from "@/components/Auth/AuthContext"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { LoginPayload } from "@/Interfaces/PayLoadINterfaces"
import SettingsService from "@/Services/SettingsService"
import { AppSettings } from "@/Interfaces/GlobalInterfaces"
import { useNavigate } from "react-router-dom"

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const userName = React.useRef<HTMLInputElement>(null)
  const password = React.useRef<HTMLInputElement>(null)
  const [errMsg, steErrMsg] = React.useState<string>("")
  const { login } = useAuthContext()
  const [aSettings, setAsettings] = React.useState<AppSettings>()
  const nav = useNavigate()

  React.useEffect(() => {
    setTimeout(() => {
      // remove all settings
      if (localStorage.getItem("AppSettings")) {
        localStorage.removeItem("AppSettings")
        sessionStorage.removeItem("showBanner")
      }
      // remove user object
      if (sessionStorage.getItem("user")) {
        sessionStorage.removeItem("user")
      }
      // fetch settings
      SettingsService.getApplicationSettings().then((response) => {
        localStorage.setItem("AppSettings", JSON.stringify(response.data.settings))
        const locSett = localStorage.getItem("AppSettings")
        if (locSett) {
          setAsettings(JSON.parse(locSett))
        }
      })
    }, 0)
  }, [])

  if (aSettings && aSettings.showMfaEnableBanner === "true") {
    sessionStorage.setItem("showBanner", "true")
  }

  const validate = () => {
    let hasErrors = false
    let msg = ""

    if (msg === "") {
      msg = ""
    }
    if (userName.current?.value.trim() === "") {
      hasErrors = true
      if (hasErrors) {
        msg = msg + "Username is mandatory! "
      }
    }
    if (password.current?.value.trim() === "") {
      console.log(msg)
      hasErrors = true
      if (hasErrors) {
        msg = msg + "A password is mandatory!"
      }
    }
    steErrMsg(msg)
    return hasErrors
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (!validate()) {
      const payload: LoginPayload = {
        userName: userName.current?.value,
        password: password.current?.value,
      }
      if (login) {
        const erg = await login(payload)
        if (erg) {
          steErrMsg(erg)
        }
      }

      setIsLoading(false)
    } else {
      setIsLoading(false)
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
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
        <form onSubmit={onSubmit}>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Username
              </Label>
              <Input
                id="username"
                placeholder="please enter your username..."
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                ref={userName}
              />
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Password
              </Label>
              <Input
                id="password"
                placeholder="please enter your password..."
                type="password"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                ref={password}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Sign In now...
            </Button>
          </div>
        </form>
        <div className="relative mt-5 mb-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
      </div>
      <div>
        {aSettings && aSettings.showRegisterLink === "true" && (
          <Button
            variant="outline"
            type="button"
            onClick={() => nav("/Register")}
            className="w-[100%]"
          >
            {<Icons.person className="mr-2 h-4 w-4 text-green-900" />}
            Register a new account..
          </Button>
        )}

        {aSettings && aSettings.showResetPasswordLink === "true" && (
          <Button
            variant="outline"
            type="button"
            className="mt-3 w-[100%]"
            onClick={() => nav("/ForgotPw1")}
          >
            {<Icons.lockClosed className="mr-2 h-4 w-4 text-red-900" />}
            Forgot your Password?
          </Button>
        )}
      </div>
    </div>
  )
}
