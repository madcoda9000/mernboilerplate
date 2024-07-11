import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { AuditEntryPayload } from "@/Interfaces/PayLoadINterfaces"
import React, { useEffect, useState } from "react"
import { Icons } from "@/components/Icons"
import { useNavigate, useParams } from "react-router-dom"
import PasswordStrengthBar, { PasswordFeedback } from "react-password-strength-bar"
import LogsService from "@/Services/LogsService"
import UsersService from "@/Services/UsersService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { User, UserClass } from "@/Interfaces/GlobalInterfaces"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import RolesService from "@/Services/RolesService"

const FormSchema = z.object({
  userName: z.string().min(1, {
    message: "Username should not be empty!.",
  }),
  firstName: z.string().min(1, {
    message: "Firstname should not be emnpty!.",
  }),
  lastName: z.string().min(1, {
    message: "Lastname should not be empty!.",
  }),
  email: z.string().min(1, {
    message: "Email should not be empty!.",
  }),
  ldapEnabled: z.boolean(),
})

interface EditUserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EditUserForm({ className, ...props }: EditUserFormProps) {
  const [user, setUser] = React.useState<User | null>(null)
  const [errMsg, setErrMsg] = useState<string>("")
  const [succMsg, SetSuccMsg] = useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [nPassword, setnPassword] = useState<string>("")
  const nav = useNavigate()
  const [pwScore, setPwScore] = React.useState<number>(0)
  const [pwScoreFeedback, setPwScoreFeedback] = useState<Array<string>>([])
  const [pwScoreWarning, setPwScoreWarning] = useState<string>("")
  const [pwVisible, setPwVisible] = useState<boolean>(false)
  const { userId } = useParams()
  const [allRoles, setAllRoles] = useState(null)
  const [replaceRoles, setReplaceRoles] = useState(true)
  const [hintText, setHintText] = useState("")

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userName: user?.userName,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await UsersService.getUser(userId !== undefined ? userId : "")
        if (!res.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "info",
            message: "Viewed User Details",
          }
          LogsService.createAuditEntry(adpl)
          setUser(res.data.user)
          form.setValue("userName", res.data.user.userName)
          form.setValue("firstName", res.data.user.firstName)
          form.setValue("lastName", res.data.user.lastName)
          form.setValue("email", res.data.user.email)
        } else {
          setErrMsg(res.data.message)
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
        setErrMsg("An error occurred while fetching user details.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [form])

  useEffect(() => {
    if (!allRoles) {
      RolesService.getRoles(1, 1000, "").then((response) => {
        if (response.data.error) {
          setErrMsg(response.data.message)
        } else {
          setAllRoles(response.data.paginatedResult)
        }
      })
    }
  }, [allRoles])

  const markCurrRole = () => {
    const inputs = document.querySelectorAll<HTMLInputElement>("[data-grp='roleName']")
    const n = inputs.length
    if (replaceRoles === true && n !== null && n > 0) {
      for (let i = 0; i < inputs.length; i++) {
        var attrName = inputs[i].getAttribute("name")
        if (attrName && user?.roles.includes(attrName)) {
          inputs[i].checked = true
        }
      }
      setReplaceRoles(false)
    }
  }

  const valChkBx = (e: string) => {
    const selBox = document.getElementById(e) as HTMLInputElement | null
    const nameAttr = selBox?.getAttribute("name")
    const isChecked = selBox?.checked

    if (isChecked && selBox !== null) {
      const grpBoxes = document.querySelectorAll<HTMLInputElement>("[data-grp='roleName']")

      if (nameAttr === "users" || nameAttr === "admins") {
        grpBoxes.forEach((box) => (box.checked = false))
        selBox.checked = true
        setHintText(
          "NOTE: If the user is a member of User or Admin role, it cannot be a member of other roles!"
        )
      } else {
        const userBox = document.querySelector<HTMLInputElement>('[name="users"]')
        const adminBox = document.querySelector<HTMLInputElement>('[name="admins"]')

        if (userBox) userBox.checked = false
        if (adminBox) adminBox.checked = false

        setHintText("")
      }
    } else if (selBox !== null) {
      selBox.checked = false
    }

    const rls = Array.from(document.querySelectorAll<HTMLInputElement>("[data-grp='roleName']"))
      .filter((box) => box.checked)
      .map((box) => box.getAttribute("name") || "")

    setUser((prevUser) => {
      if (prevUser && prevUser.roles !== null) {
        return { ...prevUser, roles: rls }
      } else {
        // Falls prevUser null oder undefined ist, erstelle einen neuen User
        return new UserClass({ roles: rls })
      }
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setnPassword(value)
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
    setnPassword(tempPW)
  }

  async function onSubmit(event: React.SyntheticEvent) {
    console.log(pwScore)
    event.preventDefault()
    setIsLoading(true)
    // check password!

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-10 lg:space-y-0">
        <div className={cn("grid gap-0 lg:w-1/3", className)} {...props}>
          {errMsg && (
            <Alert className="mb-5" variant="destructive">
              <InfoCircledIcon className="h-4 w-4" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                <div dangerouslySetInnerHTML={{ __html: errMsg }}></div>
              </AlertDescription>
            </Alert>
          )}
          {succMsg && (
            <Alert className="mb-5" variant="success">
              <InfoCircledIcon className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{succMsg}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <div className="grid gap-3">
              <div className="">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Icons.person className="inline relative top-[6px] mr-[10px] left-[3px] -translate-y-1/2 transform h-[16px] w-[16px]" />
                        The username
                      </FormLabel>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Icons.home className="inline relative top-[6px] mr-[10px] left-[3px] -translate-y-1/2 transform h-[16px] w-[16px]" />
                        The Firstname
                      </FormLabel>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Icons.home className="inline relative top-[6px] mr-[10px] left-[3px] -translate-y-1/2 transform h-[16px] w-[16px]" />
                        The Lastname
                      </FormLabel>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Icons.envelope className="inline relative top-[6px] mr-[10px] left-[3px] -translate-y-1/2 transform h-[16px] w-[16px]" />
                        The email adress
                      </FormLabel>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormLabel>
                  <Icons.lockOpen className="inline relative top-[6px] mr-[10px] left-[3px] -translate-y-1/2 transform h-[16px] w-[16px]" />
                  The Password
                </FormLabel>
                <Input
                  id="password"
                  placeholder="please enter a password..."
                  type={pwVisible === false ? "password" : "text"}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={nPassword}
                  onChange={handlePasswordChange}
                  className="mt-2"
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.reload
                      className="relative top-[-57px] left-[130px] -translate-y-1/2 transform h-[16px] w-[16px]"
                      style={{ cursor: "pointer", color: "2b90ef" }}
                      title="generate a secure password..."
                      onClick={() => handleGeneratePassword(12)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate a strong password.</p>
                  </TooltipContent>
                </Tooltip>
                {pwVisible === false ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <TooltipContent>
                        <p>toggle password visibilityd.</p>
                      </TooltipContent>
                      <Icons.eyeClosed
                        className="relative top-[-57px] left-[140px] -translate-y-1/2 transform h-[16px] w-[16px]"
                        style={{ cursor: "pointer", color: "#25c281" }}
                        title="generate a secure password..."
                        onClick={() => handlePwVisibility()}
                      />
                    </TooltipTrigger>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <TooltipContent>
                        <p>toggle password visibility.</p>
                      </TooltipContent>
                      <Icons.eyeyOpen
                        className="relative top-[-71px] left-[160px] -translate-y-1/2 transform h-[16px] w-[16px]"
                        style={{ cursor: "pointer" }}
                        title="generate a secure password..."
                        onClick={() => handlePwVisibility()}
                      />
                    </TooltipTrigger>
                  </Tooltip>
                )}
              </div>
              <div className="max-w-2xl">
                <PasswordStrengthBar
                  style={{ marginTop: "-38px" }}
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
              <div
                className="max-w-2xl text-sm text-muted-foreground"
                style={{ marginTop: "-41px" }}
              >
                {pwScoreFeedback &&
                  pwScoreFeedback.map((tip, index) => <span key={index}>{tip}</span>)}
                <div className="max-w-2xl text-sm text-destructive">
                  <span>{pwScoreWarning}</span>
                </div>
              </div>
              <div className="flex w-full max-w-sm items-center space-x-2 mt-3">
                <Button onClick={() => nav("/Admin/Users")} variant={"outline"}>
                  Cancel
                </Button>
                <Button disabled={isLoading} className="w-[100%]">
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  update User...
                </Button>
              </div>
            </div>
          </Form>
        </div>
        <aside className="-mx-4 lg:w-2/3 border-l pl-5">
          {user !== null && user.userName === "super.admin" ? (
            <Alert variant={"info"} className="mb-5" id="a1">
              <Icons.infoCircle className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Role assignment for user {user !== null ? user.userName : ""} disabled!
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant={"info"} className="mb-5" id="a1">
              <Icons.infoCircle className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>Please select one or more roles</AlertDescription>
            </Alert>
          )}
          {hintText && (
            <Alert variant={"destructive"} className="mb-5" id="a2">
              <Icons.exclamationTriangle className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>{hintText}</AlertDescription>
            </Alert>
          )}
          {allRoles !== null &&
            allRoles.docs.map((role, i) => {
              return (
                <label className="checkbox container block" key={i}>
                  {role.roleName}
                  <input
                    disabled={user !== null ? user.userName === "super.admin" : false}
                    onChange={(e) => valChkBx(e.target.id)}
                    type="checkbox"
                    name={role.roleName}
                    id={role.roleName}
                    data-rname={role.roleName}
                    data-grp="roleName"
                  />
                  <span></span>
                </label>
              )
            })}
          {markCurrRole()}
        </aside>
      </div>
    </>
  )
}
