"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import UsersService from "@/Services/UsersService"
import { useSearchParams, useNavigate } from "react-router-dom"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from "@/components/Icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PasswordStrengthBar, { PasswordFeedback } from "react-password-strength-bar"
import { forgotPw2Payload } from "@/Interfaces/PayLoadINterfaces"

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Renders a form for resetting a user's password.
 *
 * @param {FormProps} props - The props for the form.
 * @return {JSX.Element} The rendered form.
 */
export function ForgotPw2Form({ className, ...props }: FormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [errMsg, setErrMsg] = React.useState<string>("")
  const [searchParams] = useSearchParams()
  const [token, setToken] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [newPw, setNewPw] = React.useState<string>("")
  const [pwScore, setPwScore] = React.useState<number>(0)
  const [pwScoreFeedback, setPwScoreFeedback] = React.useState<Array<string>>([])
  const [pwScoreWarning, setPwScoreWarning] = React.useState<string>("")
  const [pwVisible, setPwVisible] = React.useState<boolean>(false)
  const nav = useNavigate()
  const [btnDisabled, setBtnDisabled] = React.useState<boolean>(true)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setNewPw(value)
  }

  const handlePwVisibility = () => {
    setPwVisible((current) => !current)
  }

  const handleGeneratePassword = (length: number) => {
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
    setPwScoreFeedback([])
    setPwScoreWarning("")
    setPwScore(4)
    setNewPw(tempPW)
  }

  React.useEffect(() => {
    if (searchParams.get("email") === null || searchParams.get("token") === null) {
      setErrMsg("Invalid email and /or token!")
    } else {
      setToken(searchParams.get("token") || "")
      setEmail(searchParams.get("email") || "")
      setErrMsg("")
      if (searchParams.get("token") !== null && searchParams.get("email") !== null) {
        setBtnDisabled(false)
      }
    }
  }, [searchParams])

  /*
  const handleChange = (e) => {
    const { value } = e.target
    setNewPw(value)
  }
*/
  const validateForm = () => {
    let hasError = false
    let msg = "<ul style='margin-left:20px;'>"

    const addError = (message: string) => {
      hasError = true
      msg += `<li>${message}</li>`
    }

    if (email === undefined || !email.trim()) {
      addError("Email is mandatory!")
    }

    if (token === undefined || !token.trim()) {
      addError("The token is mandatory!")
    }

    if (newPw === undefined || !newPw.trim()) {
      addError("Please enter a Lastname!")
    } else if (pwScore < 4) {
      addError("<li>A <b>strong</b> password is mandatory!</li> ")
    }

    if (hasError) {
      msg += "</ul>"
      setErrMsg(msg)
    }

    return hasError
  }

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    if (!validateForm()) {
      const payload: forgotPw2Payload = {
        email: email,
        token: token,
        password: newPw,
      }
      UsersService.forgotPw2(payload).then((response) => {
        if (response.data.error) {
          setErrMsg(response.data.message)
        } else {
          window.location.href = "/login?msg=res"
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
            <AlertDescription>
              <div dangerouslySetInnerHTML={{ __html: errMsg }}></div>
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={onSubmit}>
          <div className="grid gap-3">
            <div className="relative flex items-center max-w-2xl">
              <Icons.lock className="absolute left-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]" />
              <Input
                id="token"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={true}
                className="pl-8"
                defaultValue={email}
              />
            </div>
            <div className="relative flex items-center max-w-2xl">
              <Icons.envelope className="absolute left-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]" />
              <Input
                id="email"
                type="email"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={true}
                className="pl-8"
                defaultValue={token}
              />
            </div>
            <div className="relative flex items-center max-w-2xl">
              <Icons.lockOpen className="absolute left-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]" />
              <Input
                id="password"
                placeholder="please enter your password..."
                type={pwVisible === false ? "password" : "text"}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={false}
                value={newPw}
                onChange={handlePasswordChange}
                className="pl-8"
              />
              <Icons.reload
                className="absolute right-2 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]"
                style={{ cursor: "pointer", color: "2b90ef" }}
                title="generate a secure password..."
                onClick={() => handleGeneratePassword(12)}
              />
              {pwVisible === false ? (
                <Icons.eyeClosed
                  className="absolute right-8 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]"
                  style={{ cursor: "pointer", color: "#25c281" }}
                  title="generate a secure password..."
                  onClick={() => handlePwVisibility()}
                />
              ) : (
                <Icons.eyeyOpen
                  className="absolute right-8 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px] text-destructive"
                  style={{ cursor: "pointer" }}
                  title="generate a secure password..."
                  onClick={() => handlePwVisibility()}
                />
              )}
            </div>
            <div className="max-w-2xl">
              <PasswordStrengthBar
                style={{ marginTop: "-15px" }}
                minLength={4}
                scoreWords={["weak", "weak", "okay", "good", "strong"]}
                barColors={["#ddd", "#ef4836", "#f6b44d", "#2b90ef", "#25c281"]}
                scoreWordClassName="flex items-start p-0 m-0 hidden"
                password={newPw}
                onChangeScore={(score: number, feedback: PasswordFeedback) => {
                  setPwScore(score)
                  if (feedback.suggestions) {
                    setPwScoreFeedback(feedback.suggestions)
                  }
                  if (feedback.warning) {
                    setPwScoreWarning(feedback.warning)
                  }
                }}
              />
            </div>
            <div className="max-w-2xl text-sm text-muted-foreground" style={{ marginTop: "-15px" }}>
              {pwScoreFeedback &&
                pwScoreFeedback.map((tip, index) => <span key={index}>{tip}</span>)}
              <div className="max-w-2xl text-sm text-destructive">
                <span>{pwScoreWarning}</span>
              </div>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-5">
              <Button onClick={() => nav("/Login")} variant={"outline"}>
                Cancel
              </Button>
              <Button disabled={btnDisabled} className="w-[100%]">
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Reset my password now!
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
