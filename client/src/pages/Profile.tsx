"use client"

import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/components/Auth/AuthContext"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/Icons"
import { useMediaQuery } from "@/components/hooks/useMediaQuery"
import { useState } from "react"
import UsersService from "@/Services/UsersService"
import { changeEmailPayload, changePasswordPayload } from "@/Interfaces/PayLoadINterfaces"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
)

const emailFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled!" })
    .email("Please enter a valid email address!"),
})

const pwFormSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(passwordValidation, {
      message: "Please use a complex password!",
    }),
  currPassword: z.string().min(1, { message: "Current password cannot be empty." }),
})

const Profile = () => {
  const { user } = useAuthContext()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [pw1Visible, setPw1Visible] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<string>("")
  const [succMsg, setSuccMsg] = useState<string>("")

  const handlePw1Visibility = () => {
    setPw1Visible((current) => !current)
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
    pwForm.setValue("password", tempPW)
  }

  // 1. Define forms.
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const pwForm = useForm<z.infer<typeof pwFormSchema>>({
    resolver: zodResolver(pwFormSchema),
    defaultValues: {
      password: "",
      currPassword: "",
    },
  })

  // 2. submit functions
  async function handleEmailFormSubmit(values: z.infer<typeof emailFormSchema>) {
    const payload: changeEmailPayload = {
      _id: user?._id,
      email: values.email,
    }
    UsersService.changeEmailAddress(payload).then((res) => {
      if (res.data.error) {
        setErrMsg(res.data.message)
      } else {
        setSuccMsg(res.data.message)
      }
    })
  }

  function handlePwFormSubmit(values: z.infer<typeof pwFormSchema>) {
    const payload: changePasswordPayload = {
      _id: user?._id,
      oldPassword: values.currPassword,
      newPassword: values.password,
    }
    UsersService.changePassword(payload).then((res) => {
      if (res.data.error) {
        setErrMsg(res.data.message)
      } else {
        setSuccMsg(res.data.message)
      }
    })
  }

  const renderEmailForm = () => {
    return (
      <>
        <section>
          <h1>
            <Icons.envelope className="inline mt-[-3px] mr-3" />
            Change your email address
          </h1>
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailFormSubmit)}
              className="space-y-4 mt-3"
            >
              <FormItem>
                <FormLabel>Your current email address</FormLabel>
                <FormControl>
                  <Input type="email" value={user?.email} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your new email address</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Input type="email" placeholder="enter your new email address" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Change my email address</Button>
            </form>
          </Form>
        </section>
      </>
    )
  }

  const renderPwForm = () => {
    return (
      <>
        <section>
          <h1>
            <Icons.lockClosed className="inline mt-[-3px] mr-3" />
            Change your Password
          </h1>
          <Form {...pwForm}>
            <form onSubmit={pwForm.handleSubmit(handlePwFormSubmit)} className="space-y-4 mt-3">
              <FormField
                control={pwForm.control}
                name="currPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your current password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="your current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={pwForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Your new password (at least min 8 chars, one uppercase letter, one lowercase
                      letter, one number and one special character (#?!@$%^&*-))
                    </FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Input
                          type={pw1Visible ? "text" : "password"}
                          placeholder="your new password"
                          {...field}
                        />
                        {pw1Visible === false ? (
                          <Icons.eyeClosed
                            className="absolute right-4 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px]"
                            style={{ cursor: "pointer", color: "#25c281" }}
                            onClick={() => handlePw1Visibility()}
                          />
                        ) : (
                          <Icons.eyeyOpen
                            className="absolute right-4 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px] text-destructive"
                            style={{ cursor: "pointer" }}
                            onClick={() => handlePw1Visibility()}
                          />
                        )}
                        <Icons.reload
                          className="absolute right-12 top-1/2 -translate-y-1/2 transform h-[16px] w-[16px] text-[blue]"
                          style={{ cursor: "pointer", color: "2b90ef" }}
                          title="generate a secure password..."
                          onClick={() => handleGeneratePassword(16)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Change my password</Button>
            </form>
          </Form>
        </section>
      </>
    )
  }

  return (
    <>
      <RoleChecker requiredRole="any" />
      <MfaChecker />
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your personal settings</h2>
          <p className="text-muted-foreground">Here you can manage your personal settings.</p>
        </div>
        <Separator className="my-3" />
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
        {isDesktop ? (
          <div className="w-full">
            <div className="flex w-[100%]">
              <div className="w-1/2 pr-10 border-r">{renderEmailForm()}</div>
              <div className="w-1/2 ml-10">{renderPwForm()}</div>
            </div>
          </div>
        ) : (
          <>
            {renderEmailForm()}
            {renderPwForm()}
          </>
        )}
      </div>
    </>
  )
}
export default Profile
