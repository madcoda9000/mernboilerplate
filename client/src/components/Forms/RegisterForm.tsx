import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { registerPayload } from "@/Interfaces/PayLoadINterfaces"
import React, { useState } from "react"
import { Icons } from "@/components/Icons"
import { useNavigate } from "react-router-dom"
import PasswordStrengthBar, { PasswordFeedback } from "react-password-strength-bar"
import axios from "axios"
declare const window: {
  BASE_URL: string
} & Window
const apiurl = window.BASE_URL

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [errMsg, setErrMsg]: [string, React.Dispatch<React.SetStateAction<string>>] =
    React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const userName = React.useRef<HTMLInputElement>(null)
  const firstName = React.useRef<HTMLInputElement>(null)
  const lastName = React.useRef<HTMLInputElement>(null)
  const email = React.useRef<HTMLInputElement>(null)
  const [nPassword, setnPassword] = useState<string>("")
  const nav = useNavigate()
  const [pwScore, setPwScore] = React.useState<number>(0)
  const [pwScoreFeedback, setPwScoreFeedback] = useState<Array<string>>([])
  const [pwScoreWarning, setPwScoreWarning] = useState<string>("")
  const [pwVisible, setPwVisible] = useState<boolean>(false)

  /**
   * Updates the state variable 'nPassword' with the value from the input element.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object representing the change in the input field.
   * @return {void} This function does not return anything.
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setnPassword(value)
  }

  /**
   * Toggles the visibility state of the password input.
   *
   * @return {void} This function does not return anything.
   */
  const handlePwVisibility = () => {
    setPwVisible((current) => !current)
  }

  /**
   * Generates a random password of the specified length using a given character set.
   *
   * @param {number} length - The length of the password to generate.
   * @return {void} This function does not return anything.
   */
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
    setnPassword(tempPW)
  }

  /**
   * Validates the registration form fields to ensure all mandatory fields are filled,
   * the email address is formatted correctly, and the password meets strength criteria.
   * Updates the error message state with a list of issues if validation fails.
   *
   * @return {boolean} Returns true if there are validation errors, otherwise false.
   */
  const validateForm = () => {
    let hasErrors = false
    let msg = "<ol>"

    /**
     * Checks if a field is mandatory and if the value is not empty.
     * Updates the error message state if the field is mandatory and empty.
     *
     * @param {HTMLInputElement | null} field - The input field to check.
     * @param {string} fieldName - The name of the field to use in the error message.
     * @return {void} This function does not return anything.
     */
    const checkMandatoryField = (field: HTMLInputElement | null, fieldName: string) => {
      if (field && !field?.value.trim()) {
        hasErrors = true
        msg += `<li>${fieldName} is mandatory!</li>`
      }
    }

    /**
     * Checks if the email address is formatted correctly.
     * Updates the error message state if the email address is not valid.
     *
     * @param {HTMLInputElement | null} field - The input field to check.
     * @return {void} This function does not return anything.
     */
    const checkEmailField = (field: HTMLInputElement | null) => {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (field && !emailRegex.test(field?.value)) {
        hasErrors = true
        msg += "<li>Please enter a valid email address!</li>"
      }
    }

    checkMandatoryField(userName.current, "Username")
    checkMandatoryField(firstName.current, "Firstname")
    checkMandatoryField(lastName.current, "Lastname")
    checkMandatoryField(email.current, "Email")
    checkEmailField(email.current)

    if (!nPassword || nPassword.trim() === "") {
      hasErrors = true
      msg += "<li>A password is mandatory!</li> "
    } else if (pwScore < 4) {
      hasErrors = true
      msg += "<li>A <b>strong</b> password is mandatory!</li> "
    }

    if (hasErrors) {
      msg += "</ol>"
    }

    setErrMsg(msg)
    return hasErrors
  }

  /**
   * Handles the form submission for the registration form. It prevents the default
   * form submission behavior, sets loading state to true, validates the form fields,
   * and sends a request to the server to create a new user. It then updates the
   * loading state based on the response from the server and sets error or success
   * messages accordingly.
   *
   * @param {React.SyntheticEvent} event - The event object representing the form
   *                                        submission event.
   */
  async function onSubmit(event: React.SyntheticEvent) {
    console.log(pwScore)
    event.preventDefault()
    setIsLoading(true)

    if (!validateForm()) {
      const payload: registerPayload = {
        userName: userName.current?.value,
        firstName: firstName.current?.value,
        lastName: lastName.current?.value,
        email: email.current?.value,
        password: nPassword,
      }
      try {
        const apiResponse = await axios.post(apiurl + "/v1/auth/signup", payload)
        if (apiResponse.data.error === false) {
          window.location.href = "/login?msg=reg"
        } else {
          console.log(apiResponse)
          setErrMsg(apiResponse.data.message)
          setIsLoading(false)
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setErrMsg(error.response?.data.message || "An error occurred")
        } else {
          setErrMsg(
            "An unexpected error occured. Please take a look into the console for further details."
          )
          console.log(error)
        }
        setIsLoading(false)
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
    <>
      <div className={cn("grid gap-0", className)} {...props}>
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
                type={pwVisible === false ? "password" : "text"}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                value={nPassword}
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
                password={nPassword}
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
