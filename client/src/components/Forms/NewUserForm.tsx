import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { AuditEntryPayload, newUserPayload } from "@/Interfaces/PayLoadINterfaces"
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
import SettingsService from "@/Services/SettingsService"

const FormSchema = z.object({
  _userName: z.string().min(1, {
    message: "Username should not be empty!.",
  }),
  _firstName: z.string().min(1, {
    message: "Firstname should not be emnpty!.",
  }),
  _lastName: z.string().min(1, {
    message: "Lastname should not be empty!.",
  }),
  _email: z.string().min(1, {
    message: "Email should not be empty!.",
  }),
  _password: z.string().optional(),
  _emailVerified: z.boolean(),
  _accountLocked: z.boolean(),
  _ldapEnabled: z.boolean(),
  _mfaEnforced: z.boolean(),
})

interface NewUserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The NewUserForm component is a form to create a new user in the system.
 * It features an input field for the user name, first name, last name, email address, and password.
 * It also has a switch to enable or disable ldap signin for the user.
 * The form also features a button to generate a secure password.
 * The form also features a switch to set the user account as verified or not.
 * The form also features a switch to set the user account as locked or not.
 * The form also features a switch to enforce MFA for the user.
 * The form also features a button to submit the form data to create a new user.
 * @param {{ className: string; [x: string]: any }} props - The component props.
 * @returns {JSX.Element} - The form component.
 */
export function NewUserForm({ className, ...props }: NewUserFormProps) {
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
  const [allRoles, setAllRoles] = useState(null)
  const [hintText, setHintText] = useState("")
  const [btnLoading, SetBtnLoading] = useState<boolean>(false)
  const [ldapGloballyEnabled, setLdapGloballyEnabled] = useState<boolean>(false)

  // form schema definition
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      _userName: user?.userName || "",
      _firstName: user?.firstName || "",
      _lastName: user?.lastName || "",
      _email: user?.email || "",
      _mfaEnforced: false,
      _ldapEnabled: false,
      _emailVerified: false,
      _accountLocked: false,
    },
  })

  /**
   * Asynchronously fetches data based on certain conditions.
   *
   * @return {void} No return value
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!allRoles) {
          const response = await RolesService.getRoles(1, 1000, "")
          if (response.data.error) {
            setErrMsg(response.data.message)
          } else {
            setAllRoles(response.data.paginatedResult)
          }
        }
        if (!user) {
          setUser(new UserClass({ roles: [] }))
        }
      } catch (error) {
        setErrMsg("Error fetching roles: " + error.message)
      }
    }

    /**
     * Asynchronously retrieves LDAP configuration settings from the server.
     *
     * Fetches LDAP settings using the SettingsService and updates the
     * state to reflect whether LDAP is globally enabled. If an error
     * occurs during the fetch, logs the error to the console and sets
     * an error message state.
     *
     * @return {Promise<void>} No return value.
     */
    const getLdapConfig = async () => {
      const res = await SettingsService.getLdapSettings()
      if (!res.data.error) {
        setLdapGloballyEnabled(res.data.settings.ldapEnabled === "true" ? true : false)
      } else {
        console.error("Error fetching ldap settings:", res.data.message)
        setErrMsg("An error occurred while fetching ldap settings.")
      }
    }
    fetchData()
    getLdapConfig()
  }, [allRoles, user])

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
   * Toggles the visibility of the password.
   *
   * @param {void} This function does not take any parameters.
   * @return {void} This function does not return anything.
   */
  const handlePwVisibility = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPwVisible((current) => !current)
  }

  /**
   * Generates a random password of a specified length using a given character set.
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
   * Submits the form data to create a new user.
   *
   * @param {z.infer<typeof FormSchema>} data - The form data containing the user information.
   * @return {void} This function does not return anything.
   * @throws {Error} If the password is empty or undefined, or if no roles are selected for the user.
   */
  function submitForm(data: z.infer<typeof FormSchema>) {
    if (nPassword === "" || nPassword === undefined) {
      setErrMsg("Please enter a password for the new User!")
    } else if (user?.roles.length === 0) {
      setErrMsg("Please select at least one role for the new User!")
    } else if (nPassword && user) {
      try {
        let payload: newUserPayload = {
          userName: data._userName,
          firstName: data._firstName,
          lastName: data._lastName,
          email: data._email,
          accountLocked: data._accountLocked,
          mfaEnforced: data._mfaEnforced,
          mfaEnabled: false,
          ldapEnabled: data._ldapEnabled,
          emailVerified: data._emailVerified,
          password: nPassword,
          roles: user.roles,
        }

        UsersService.createUser(payload).then((response) => {
          if (response.data.error) {
            setErrMsg(response.data.message)
          } else {
            const adpl: AuditEntryPayload = {
              user: JSON.parse(sessionStorage.getItem("user")!).userName,
              level: "info",
              message: "Created User " + data._userName,
            }
            LogsService.createAuditEntry(adpl)
            setErrMsg("")
            form.reset()
            SetSuccMsg(response.data.message)
            SetBtnLoading(false)
          }
        })
      } catch (error) {
        setErrMsg("Error: " + error)
      }
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
            <form>
              <div className="grid gap-3">
                <div className="">
                  <FormField
                    control={form.control}
                    name="_userName"
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
                    name="_firstName"
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
                    name="_lastName"
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
                    name="_email"
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
                    name="_accountLocked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-0">
                        <div className="space-y-0.5">
                          <FormLabel className="">Account Status</FormLabel>
                          <FormDescription className=" pr-3">
                            Wether to set the account is locked or not (locked = switch on!).
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
                    name="_mfaEnforced"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-0">
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
                    name="_ldapEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-0">
                        <div className="space-y-0.5">
                          <FormLabel className="">LDAP SIgnin</FormLabel>
                          <FormDescription className=" pr-3">
                            {ldapGloballyEnabled === false ? (
                              <span className="text-red-500">LDAP is disabled in backend.</span>
                            ) : (
                              "Wether to enable ldap signin for this account."
                            )}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            id="ldapEnabled"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={ldapGloballyEnabled === false ? true : false}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ml-[12px] mr-[12px]">
                  <FormField
                    control={form.control}
                    name="_emailVerified"
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
                      <b>Note:</b> If ldap signin is enabled for this account simply enter any
                      password here as it is not used on signin.
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
                        onClick={(e) => handleGeneratePassword(e, 14)}
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
                          <p>toggle password visibility.</p>
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
                  <Button type="button" onClick={form.handleSubmit(submitForm)}>
                    {btnLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}save new
                    user.....
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <aside className="-mx-4 lg:w-2/3 border-l pl-5">
          {infoRolesText && (
            <Alert variant={"info"} className="mb-5" id="a1">
              <Icons.infoCircle className="h-4 w-4" />
              <AlertTitle>Note!</AlertTitle>
              <AlertDescription>{infoRolesText}</AlertDescription>
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
