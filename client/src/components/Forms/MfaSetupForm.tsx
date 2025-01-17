"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/components/Auth/AuthContext"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useNavigate } from "react-router-dom"
import LogsService from "@/Services/LogsService"
import {
  AuditEntryPayload,
  disableMfaPayload,
  validateOtpPayload,
} from "@/Interfaces/PayLoadINterfaces"
import UsersService from "@/Services/UsersService"
import QRCode from "react-qr-code"
import Otp from "@/components/ui/otp"
import { AccordionContent, AccordionItem, Accordion, AccordionTrigger } from "../ui/accordion"

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * MfaSetupForm
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - External class name
 * @returns {JSX.Element} MfaSetupForm component
 */
export function MfaSetupForm({ className, ...props }: FormProps) {
  const { user, logout } = useAuthContext()
  const [qrcodeUrl, setqrcodeUrl] = React.useState<string>("")
  const [totpSecret, settotpSecret] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const [otpToken, setOtpToken] = React.useState<number>(0)
  const [errMsg, setErrMsg] = React.useState<string>("")
  const [succMsg, setSuccMsg] = React.useState<string>("")
  const [activatedSuccessfully, setActivatedSuccessfully] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (user) {
      console.log("mfaEnabled: " + user.mfaEnabled + " | mfaEnforced:" + user.mfaEnforced)
      if (user.mfaEnabled) {
        setqrcodeUrl("kakai")
      } else if (!user.mfaEnabled || user.mfaEnforced) {
        const payload = {
          _id: user._id,
        }
        UsersService.startMfaSetup(payload).then((response) => {
          if (response.data.error) {
            setErrMsg(response.data.message)
          } else {
            const payload: AuditEntryPayload = {
              user: user.userName,
              level: "info",
              message: user.userName + " started 2fa setup..",
            }
            LogsService.createAuditEntry(payload)
            settotpSecret(response.data.base32)
            setqrcodeUrl(response.data.otpUrl)
          }
        })
      }
    }
  }, [user])

  /**
   * Handles a change to the OTP input field
   * @param {number} e The new OTP value
   */
  const handleChange = (e: number) => {
    //console.log(e);
    setOtpToken(e)
  }

  /**
   * Verifies the OTP for a user's 2FA setup.
   *
   * @param {React.SyntheticEvent} e - The event that triggered the OTP verification
   *
   * @return {void}
   */
  const verifyOtp = (e: React.SyntheticEvent) => {
    if (user) {
      e.preventDefault()
      setIsLoading(true)
      const payload: validateOtpPayload = {
        _id: user._id,
        token: "" + otpToken,
      }
      UsersService.finishMfaSetup(payload).then((response) => {
        if (response.data.error) {
          setIsLoading(false)
          setErrMsg(response.data.message)
        } else {
          const payload: AuditEntryPayload = {
            user: user.userName,
            level: "info",
            message: user.userName + " finished 2fa setup successfully!",
          }
          LogsService.createAuditEntry(payload)
          setIsLoading(false)
          setErrMsg("")
          setActivatedSuccessfully(true)
          setSuccMsg(response.data.message)
          let mcount = 1
          const inv = setInterval(() => {
            if (mcount > 0) {
              mcount = mcount - 1
            } else {
              goHome(inv)
            }
          }, 1000)
        }
      })
      setIsLoading(false)
    }
  }

  /**
   * Navigates the user to the login page and clears the given interval.
   *
   * @param {NodeJS.Timeout} intervalId - The interval ID to be cleared.
   */
  function goHome(intervalId: NodeJS.Timeout) {
    clearInterval(intervalId)
    navigate("/login")
  }

  /**
   * Cancels the MFA setup process by removing the user from session storage
   * and navigating the user to the home or login page depending on the
   * enforcement status of MFA for the user.
   *
   * If MFA is enforced for the user, the user is logged out and navigated to
   * the login page. If MFA is not enforced for the user, the user is simply
   * navigated to the home page.
   *
   * @return {void}
   */
  const cancelMfaLogin = () => {
    if (user?.mfaEnforced) {
      if (sessionStorage.getItem("user")) {
        sessionStorage.removeItem("user")
      }
      auditMfaSetupAbort()
      logout()
      navigate("/Login")
    } else {
      auditMfaSetupAbort()
      navigate("/Home")
    }
  }

  /**
   * Creates an audit log entry for a user aborting their 2FA setup.
   *
   * @return {void}
   */
  const auditMfaSetupAbort = () => {
    if (user) {
      const payload: AuditEntryPayload = {
        user: user.userName,
        level: "info",
        message: user.userName + " aborted 2fa setup..",
      }
      LogsService.createAuditEntry(payload)
    }
  }

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Disables MFA for the user by calling the UsersService disableMfa method.
   *
   * @return {void}
   */
  /******  2fd664ed-8ede-4423-9ec6-bf96f8996dba  *******/
  const disableMfa = () => {
    if (user) {
      setIsLoading(true)
      const payload: disableMfaPayload = {
        _id: user._id,
        execUserId: user._id,
      }
      UsersService.disableMfa(payload).then((response) => {
        if (response.data.error) {
          setErrMsg(response.data.message)
          setIsLoading(false)
        } else {
          setIsLoading(false)
          setErrMsg("")
          setSuccMsg(response.data.message)
          setActivatedSuccessfully(true)
          let mcount = 1
          const inv = setInterval(() => {
            if (mcount > 0) {
              mcount = mcount - 1
            } else {
              goHome(inv)
            }
          }, 1000)
        }
      })
    }
  }

  return (
    <div className={cn("", className)} {...props}>
      <div className="grid gap-6">
        {user && user.mfaEnabled ? (
          <>
            {errMsg && (
              <Alert className="mb-5" variant="destructive">
                <InfoCircledIcon className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{errMsg}</AlertDescription>
              </Alert>
            )}
            {succMsg && (
              <Alert variant={"success"}>
                <InfoCircledIcon className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                {succMsg}
              </Alert>
            )}
            <Alert variant={"default"}>
              <AlertDescription>
                You've successfully configured 2FA Authentication.
                <br /> <br />
                <b>
                  It is strongly recommended to leave 2FA Authentication enabled as it dramatically
                  increases your account security.
                </b>
                <br />
                <br />
                If you still want to disable 2FA Authentication for your account, you can do so by
                clicking the button below. <b>Note:</b> by deactivating 2FA authentication, you'll
                getting logged out and you've to login again!
                <br />
              </AlertDescription>
            </Alert>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-5">
              <Button type="button" onClick={() => navigate("/Home")} variant={"outline"}>
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                type="button"
                disabled={isLoading}
                className="w-[100%]"
                onClick={() => disableMfa()}
              >
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                disable 2FA Authentication
              </Button>
            </div>
          </>
        ) : (
          <>
            {user && user.mfaEnforced ? (
              <>
                {errMsg && (
                  <Alert className="mb-5" variant="destructive">
                    <InfoCircledIcon className="h-4 w-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{errMsg}</AlertDescription>
                  </Alert>
                )}
                {succMsg && (
                  <Alert variant={"success"}>
                    <InfoCircledIcon className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    {succMsg}
                  </Alert>
                )}
                <Alert variant={"default"}>
                  <AlertDescription>
                    <b>
                      Your administrator has enforced to enable 2FA Authentication for your account.
                    </b>
                    <br /> <br />
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger style={{ color: "#2b90ef" }}>
                          <Icons.infoCircle className="inline mt-[-2px]" />
                          &nbsp;Enable 2FA AUthentication in three steps:
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul>
                            <li>
                              1. Donwload an OTP App like Google Authenticator&nbsp;
                              <a
                                href="https://play.google.com/store/search?q=google%20authenticator&c=apps&hl=de&gl=US"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icons.playStore
                                  className="h-[16px] w-[16px]"
                                  style={{ display: "inline", color: "#25c281" }}
                                />
                              </a>
                              &nbsp;
                              <a
                                href="https://apps.apple.com/de/app/google-authenticator/id388497605"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icons.apple
                                  className="h-[16px] w-[16px]"
                                  style={{ display: "inline" }}
                                />
                              </a>
                              &nbsp; or Microsoft Authenticator&nbsp;
                              <a
                                href="https://play.google.com/store/search?q=microsoft%20authenticator&c=apps&hl=de&gl=US"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icons.playStore
                                  className="h-[16px] w-[16px]"
                                  style={{ display: "inline", color: "#25c281" }}
                                />
                              </a>
                              &nbsp;
                              <a
                                href="https://apps.apple.com/de/app/microsoft-authenticator/id983156458"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icons.apple
                                  className="h-[16px] w-[16px]"
                                  style={{ display: "inline" }}
                                />
                              </a>
                            </li>
                            <br></br>
                            <li>
                              2. Scan the barcode, shown below, with your OTP Authenticator app or
                              enter the the secret manually in your Authenticator app
                            </li>
                            <br></br>
                            <li>
                              3. Insert the OTP Code shown by your Authenticator App into the number
                              fields below and click the "Verfify my code" button. NOTE: After
                              enableing 2FA you'll be logged out and have to login again!
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AlertDescription>
                </Alert>
                <div className="flex w-full max-w-sm items-start space-x-2 mt-1">
                  <QRCode value={qrcodeUrl} size={128} className="mr-2" />
                  {totpSecret ? totpSecret : "secret here.."}
                </div>
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
                        {activatedSuccessfully && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
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
              </>
            ) : (
              <>
                {errMsg && (
                  <Alert className="mb-5" variant="destructive">
                    <InfoCircledIcon className="h-4 w-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{errMsg}</AlertDescription>
                  </Alert>
                )}
                {succMsg && (
                  <Alert variant={"success"}>
                    <InfoCircledIcon className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    {succMsg}
                  </Alert>
                )}
                <Alert variant={"info"}>
                  <AlertDescription>
                    <b>Great that you're willing to enable 2FA Authentication!</b>
                    <br /> <br />
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger style={{ color: "#fff" }}>
                          <Icons.infoCircle className="inline mt-[-2px]" />
                          &nbsp;Enable 2FA AUthentication in three steps:
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul>
                            <li>
                              1. Donwload an OTP App like Google Authenticator&nbsp;
                              <a
                                href="https://play.google.com/store/search?q=google%20authenticator&c=apps&hl=de&gl=US"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icons.playStore
                                  className="h-[16px] w-[16px]"
                                  style={{ display: "inline", color: "#25c281" }}
                                />
                              </a>
                              &nbsp;
                              <a
                                href="https://apps.apple.com/de/app/google-authenticator/id388497605"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icons.apple
                                  className="h-[16px] w-[16px]"
                                  style={{ display: "inline" }}
                                />
                              </a>
                              &nbsp; or Microsoft Authenticator&nbsp;
                              <a
                                href="https://play.google.com/store/search?q=microsoft%20authenticator&c=apps&hl=de&gl=US"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icons.playStore
                                  className="h-[16px] w-[16px]"
                                  style={{ display: "inline", color: "#25c281" }}
                                />
                              </a>
                              &nbsp;
                              <a
                                href="https://apps.apple.com/de/app/microsoft-authenticator/id983156458"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Icons.apple
                                  className="h-[16px] w-[16px]"
                                  style={{ display: "inline" }}
                                />
                              </a>
                            </li>
                            <br></br>
                            <li>
                              2. Scan the barcode, shown below, with your OTP Authenticator app or
                              enter the the secret manually in your Authenticator app
                            </li>
                            <br></br>
                            <li>
                              3. Insert the OTP Code shown by your Authenticator App into the number
                              fields below and click the "Verfify my code" button. NOTE: After
                              enableing 2FA you'll be logged out and have to login again!
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AlertDescription>
                </Alert>
                <div className="flex w-full max-w-sm items-start space-x-2 mt-1">
                  <QRCode value={qrcodeUrl} size={128} className="mr-2" />
                  {totpSecret ? totpSecret : "secret here.."}
                </div>
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
                        {activatedSuccessfully && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
