"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"
import UsersService from "@/Services/UsersService"
import { forgotPw1Payload } from "@/Interfaces/PayLoadINterfaces"

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPw1Form({ className, ...props }: FormProps) {
  const [errMsg, setErrMsg] = React.useState<string>("")
  const [succMsg, setSuccMsg] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const uMail = React.useRef<HTMLInputElement>(null)
  const nav = useNavigate()

  const validate = () => {
    let hasErrors = false
    let msg = ""
    if (msg === "") {
      msg = ""
    }

    if (uMail.current && uMail.current.value.trim() === "") {
      hasErrors = true
      if (hasErrors) {
        msg = msg + "Email address is mandatory! "
      }
    }

    if (uMail.current && uMail.current.value.trim() !== "") {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (uMail.current && !emailRegex.test(uMail.current.value)) {
        hasErrors = true
        if (hasErrors) {
          msg = msg + "Please enter a valid email address!"
        }
      }
    }
    setErrMsg(msg)
    return hasErrors
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    if (uMail.current && !validate()) {
      const payload: forgotPw1Payload = {
        email: uMail.current.value,
      }
      UsersService.forgotPw1(payload).then((response) => {
        if (response.data.error) {
          setIsLoading(false)
          setErrMsg(response.data.message)
        } else {
          setIsLoading(false)
          setSuccMsg(response.data.message)
        }
      })
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("", className)} {...props}>
      <div className="grid">
        {errMsg && (
          <Alert className="mb-5" variant="destructive">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{errMsg}</AlertDescription>
          </Alert>
        )}
        {succMsg ? (
          <Alert className="mb-5" variant="default">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertDescription>{succMsg}</AlertDescription>
          </Alert>
        ) : (
          <Alert
            className="mb-5"
            variant="default"
            style={errMsg ? { display: "none" } : { display: "block" }}
          >
            <AlertDescription>
              <span className="text-lg">Resetting your password requires two steps.</span>
              <br /> <br />
              <b>Step 1</b>
              <br />
              Enter your email address and click on "reset my password".
              <br />
              After doing so, your{" "}
              <b className="text-destructive">account will become deactivated</b> until you complete
              Step 2.
              <br />
              <br />
              <b>Step 2</b>
              <br />
              You'll receive an email with an link to an page where you can provide an new password
              for your account.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <div className="grid gap-3">
            <div className="relative flex items-center max-w-2xl">
              <Icons.envelope className="absolute left-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]" />
              <Input
                id="email"
                placeholder="please enter your email address"
                type="email"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                ref={uMail}
                className="pl-8"
              />
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-1">
              <Button onClick={() => nav("/Login")} variant={"outline"}>
                Cancel
              </Button>
              <Button disabled={isLoading} className="w-[100%]">
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Reset my password...
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
