import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { registerPayload } from "@/Interfaces/PayLoadINterfaces"
import React, { useState } from "react"
import { Icons } from "@/components/Icons"
import { useNavigate } from "react-router-dom"

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [errMsg, setErrMsg] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const userName = React.useRef<HTMLInputElement>(null)
  const firstName = React.useRef<HTMLInputElement>(null)
  const lastName = React.useRef<HTMLInputElement>(null)
  const email = React.useRef<HTMLInputElement>(null)
  const [nPassword, setnPassword] = useState<string>("")
  const nav = useNavigate()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setnPassword(value)
  }

  const handleGeneratePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*()-_=+"

    const getRandomInt = (max: number) => {
      const randomBuffer = new Uint32Array(1)
      crypto.getRandomValues(randomBuffer)
      return Math.floor((randomBuffer[0] / (0xffffffff + 1)) * max)
    }

    let tempPW = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = getRandomInt(charset.length)
      tempPW += charset[randomIndex]
    }

    setnPassword(tempPW)
  }

  const validate = () => {
    let hasErrors = false
    let msg = ""

    const checkMandatoryField = (field: HTMLInputElement | null, fieldName: string) => {
      if (field && !field?.value.trim()) {
        hasErrors = true
        msg += `${fieldName} is mandatory! `
      }
    }

    const checkEmailField = (field: HTMLInputElement | null) => {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (field && !emailRegex.test(field?.value)) {
        hasErrors = true
        msg += "Please enter a valid email address! "
      }
    }

    checkMandatoryField(userName.current, "Username")
    checkMandatoryField(firstName.current, "Firstname")
    checkMandatoryField(lastName.current, "Lastname")
    checkMandatoryField(email.current, "Email")
    checkEmailField(email.current)

    if (!nPassword || nPassword.trim() === "") {
      hasErrors = true
      msg += "A password is mandatory! "
    }

    setErrMsg(msg)
    return hasErrors
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (!validate()) {
      const payload: registerPayload = {
        userName: userName.current?.value,
        firstName: firstName.current?.value,
        lastName: lastName.current?.value,
        email: email.current?.value,
        password: nPassword,
      }
      /* TODO: api call to create user */

      setIsLoading(false)
    } else {
      setIsLoading(false)
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <>
      <div className={cn("grid gap-0", className)} {...props}>
        {errMsg && (
          <Alert className="mb-5" variant="destructive">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{errMsg}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={onSubmit}>
          <div className="grid gap-3">
            <div className="relative flex items-center max-w-2xl">
              <Icons.person className="absolute left-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]" />
              <Input
                id="username"
                placeholder="please enter a username..."
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                ref={userName}
                className="pl-8"
              />
            </div>
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
                ref={email}
                className="pl-8"
              />
            </div>
            <div className="relative flex items-center max-w-2xl">
              <Icons.home className="absolute left-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]" />
              <Input
                id="firstname"
                placeholder="please enter your firstname"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                ref={firstName}
                className="pl-8"
              />
            </div>
            <div className="relative flex items-center max-w-2xl">
              <Icons.home className="absolute left-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]" />
              <Input
                id="lastname"
                placeholder="please enter your lastname"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                ref={lastName}
                className="pl-8"
              />
            </div>
            <div className="relative flex items-center max-w-2xl">
              <Icons.lockOpen className="absolute left-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]" />
              <Input
                id="password"
                placeholder="please enter your password..."
                type="password"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                value={nPassword}
                onChange={handlePasswordChange}
                className="pl-8"
              />
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Button onClick={() => nav("/Login")} variant={"outline"}>
                Cancel
              </Button>
              <Button disabled={isLoading} className="w-[100%]">
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Register...
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
