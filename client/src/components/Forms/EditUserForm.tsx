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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { User, UserClass } from "@/Interfaces/GlobalInterfaces"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import RolesService from "@/Services/RolesService"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

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
  password: z.string().optional(),
  emailVerified: z.boolean(),
  accountLocked: z.boolean(),
  ldapEnabled: z.boolean(),
  mfaEnforced: z.boolean(),
})

interface EditUserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Renders an edit user form with various input fields and role selection.
 *
 * @param {EditUserFormProps} props - The props object containing className and other props.
 * @return {JSX.Element} The rendered edit user form.
 */
export function EditUserForm({ className, ...props }: EditUserFormProps) {
  const [user, setUser] = React.useState<User | null>(null)
  const [errMsg, setErrMsg] = useState<string>("")
  const [succMsg, SetSuccMsg] = useState<string>("")
  const [infoRolesText, setInfoRolesText] = useState<string>("Please select one or more roles")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [nPassword, setnPassword] = useState<string>("")
  const nav = useNavigate()
  const [pwScore, setPwScore] = React.useState<number>(0)
  const [pwScoreFeedback, setPwScoreFeedback] = useState<Array<string>>([])
  const [pwScoreWarning, setPwScoreWarning] = useState<string>("")
  const [pwVisible, setPwVisible] = useState<boolean>(false)
  const { userId } = useParams()
  const [allRoles, setAllRoles] = useState(null)
  const [hintText, setHintText] = useState("")
  const [btnLoading, SetBtnLoading] = useState<boolean>(false)

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

  /**
   * Fetches user data and sets values in the form.
   *
   * @param {void}
   * @return {Promise<void>} Promise that resolves once user data is fetched and form values are set
   */
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
          form.setValue("accountLocked", res.data.user.accountLocked)
          form.setValue("emailVerified", res.data.user.emailVerified)
          form.setValue("ldapEnabled", res.data.user.ldapEnabled)
          form.setValue("mfaEnforced", res.data.user.mfaEnforced)
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
  }, [form, userId])

  /**
   * Validates and updates the selected checkbox and related user roles.
   *
   * @param {string} e - The id of the checkbox element.
   * @return {void} This function does not return anything.
   */
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
          "If the user is a member of User or Admin role, it cannot be a member of other roles!"
        )
        setInfoRolesText("")
      } else {
        const userBox = document.querySelector<HTMLInputElement>('[name="users"]')
        const adminBox = document.querySelector<HTMLInputElement>('[name="admins"]')

        if (userBox) userBox.checked = false
        if (adminBox) adminBox.checked = false

        setHintText("")
        setInfoRolesText("Please select one or more roles")
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

  /**
   * A function that handles the change event for the password input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object representing the change in the input field.
   * @return {void} This function does not return anything.
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setnPassword(value)
  }

  /**
   * Toggles the visibility of the password.
   *
   * @return {void} This function does not return anything.
   */
  const handlePwVisibility = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPwVisible((current) => !current)
  }

  /**
   * Generates a random password of the specified length using a given character set.
   *
   * @param {number} length - The length of the password to generate.
   * @return {void} This function does not return anything.
   */
  const handleGeneratePassword = (e: React.MouseEvent, length: number) => {
    e.preventDefault()
    e.stopPropagation()
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
   * A function that handles form submission, updates user data, and triggers service calls based on the form data.
   *
   * @param {z.infer<typeof FormSchema>} data - The form data containing user information.
   * @return {void} No return value.
   */
  function onSubmit(data: z.infer<typeof FormSchema>) {
    SetBtnLoading(true)
    if (user !== null) {
      let tempUser = user
      tempUser.userName = data.userName
      tempUser.firstName = data.firstName
      tempUser.lastName = data.lastName
      tempUser.email = data.email
      tempUser.ldapEnabled = data.ldapEnabled
      tempUser.mfaEnforced = data.mfaEnforced
      tempUser.accountLocked = data.accountLocked
      tempUser.emailVerified = data.emailVerified
      console.log(data.password)
      nPassword !== undefined ? (tempUser.password = nPassword) : (tempUser.password = "")
      console.log(nPassword)
      UsersService.updateUser(tempUser).then((response) => {
        if (response.data.error) {
          setErrMsg(response.data.message)
        } else {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "info",
            message: "Modified User " + user.userName,
          }
          LogsService.createAuditEntry(adpl)
          SetSuccMsg(response.data.message)
          SetBtnLoading(false)
        }
      })
    }
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-3">
                <div className="">
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3">
                        <FormLabel className="relative ml-[12px]">Username</FormLabel>
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
                      <FormItem className="flex items-center space-x-3">
                        <FormLabel className="relative ml-[12px]">Firstname</FormLabel>
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
                      <FormItem className="flex items-center space-x-3">
                        <FormLabel className="relative ml-[12px]">Lastname</FormLabel>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-9">
                        <FormLabel className="relative ml-[12px]">Email</FormLabel>
                        <FormControl>
                          <Input type="text" value={field.value} onChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="relative ml-[12px] mr-[12px]">
                  <FormField
                    control={form.control}
                    name="accountLocked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-0">
                        <div className="space-y-0.5">
                          <FormLabel className="">Account Status</FormLabel>
                          <FormDescription className=" pr-3">
                            Wether to set the account activated or not.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            id="accountLocked"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ml-[12px] mr-[12px]">
                  <FormField
                    control={form.control}
                    name="mfaEnforced"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-02">
                        <div className="space-y-0.5">
                          <FormLabel className="">MFA Enforcement</FormLabel>
                          <FormDescription className=" pr-3">
                            Wether to enforce MFA for this user.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            id="mfaEnforced"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ml-[12px] mr-[12px]">
                  <FormField
                    control={form.control}
                    name="ldapEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-0">
                        <div className="space-y-0.5">
                          <FormLabel className="">LDAP SIgnin</FormLabel>
                          <FormDescription className=" pr-3">
                            Wether to enable ldap signin for this account.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            id="ldapEnabled"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ml-[12px] mr-[12px]">
                  <FormField
                    control={form.control}
                    name="emailVerified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-0">
                        <div className="space-y-0.5">
                          <FormLabel className="">Email verification</FormLabel>
                          <FormDescription className=" pr-3">
                            Set the users email addres as verified already.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            id="emailVerified"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="">
                  <FormLabel className="relative ml-[12px]">The Password</FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <Icons.infoCircle className="relative text-blue top-[11px] left-[3px] -translate-y-1/2 transform h-[16px] w-[16px]" />
                    </PopoverTrigger>
                    <PopoverContent className="bg-blue text-white">
                      <b>Note:</b> If you don't want to change the users password, simply leave the
                      field empty!
                    </PopoverContent>
                  </Popover>

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
                        className="relative top-[-57px] left-[146px] -translate-y-1/2 transform h-[16px] w-[16px]"
                        style={{ cursor: "pointer", color: "2b90ef" }}
                        title="generate a secure password..."
                        onClick={(e) => handleGeneratePassword(e, 12)}
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
                          className="relative top-[-57px] left-[156px] -translate-y-1/2 transform h-[16px] w-[16px]"
                          style={{ cursor: "pointer", color: "#25c281" }}
                          title="generate a secure password..."
                          onClick={(e) => handlePwVisibility(e)}
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
                          className="relative top-[-57px] left-[156px] -translate-y-1/2 transform h-[16px] w-[16px]"
                          style={{ cursor: "pointer" }}
                          title="generate a secure password..."
                          onClick={(e) => handlePwVisibility(e)}
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
                  <Button type="submit">
                    {btnLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}update
                    user.....
                  </Button>
                </div>
              </div>
            </form>
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
            <>
              {infoRolesText && (
                <Alert variant={"info"} className="mb-5" id="a1">
                  <Icons.infoCircle className="h-4 w-4" />
                  <AlertTitle>Note!</AlertTitle>
                  <AlertDescription>{infoRolesText}</AlertDescription>
                </Alert>
              )}
            </>
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
                    checked={user?.roles.includes(role.roleName) ? true : false}
                  />
                  <span></span>
                </label>
              )
            })}
        </aside>
      </div>
    </>
  )
}
