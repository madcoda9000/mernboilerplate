"use client"

import SettingsService from "@/Services/SettingsService"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { AuditEntryPayload, appSettingsPayload } from "@/Interfaces/PayLoadINterfaces"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Icons } from "../Icons"
import { useNavigate } from "react-router-dom"
import LogsService from "@/Services/LogsService"

const FormSchema = z.object({
  showMfaEnableBanner: z.boolean(),
  showQuoteOfTheDay: z.boolean(),
  showRegisterLink: z.boolean(),
  showResetPasswordLink: z.boolean(),
})

/**
 * Renders a form for updating application settings.
 *
 * @return {JSX.Element} The rendered form component.
 */
const AppsettingsForm = () => {
  const [settings, setSettings] = useState<appSettingsPayload | null>(null)
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const [btnLoading, SetBtnLoading] = useState<boolean>(false)
  const [errMsg, SetErrMsg] = useState<string>("")
  const [succMsg, SetSuccMsg] = useState<string>("")
  const nav = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      showMfaEnableBanner: settings?.showMfaEnableBanner === "true" ? true : false,
      showQuoteOfTheDay: settings?.showQuoteOfTheDay === "true" ? true : false,
      showRegisterLink: settings?.showRegisterLink === "true" ? true : false,
      showResetPasswordLink: settings?.showResetPasswordLink === "true" ? true : false,
    },
  })

  useEffect(() => {
    const fetchData = () => {
      try {
        SettingsService.getApplicationSettings().then((res) => {
          if (!res.data.error) {
            const adpl: AuditEntryPayload = {
              user: JSON.parse(sessionStorage.getItem("user")!).userName,
              level: "info",
              message: "Viewed Application Settingss",
            }
            LogsService.createAuditEntry(adpl)
            setSettings(res.data)
            form.setValue(
              "showMfaEnableBanner",
              res.data.settings.showMfaEnableBanner === "true" ? true : false
            )
            form.setValue(
              "showQuoteOfTheDay",
              res.data.settings.showQuoteOfTheDay === "true" ? true : false
            )
            form.setValue(
              "showRegisterLink",
              res.data.settings.showRegisterLink === "true" ? true : false
            )
            form.setValue(
              "showResetPasswordLink",
              res.data.settings.showResetPasswordLink === "true" ? true : false
            )
          } else {
            SetErrMsg(res.data.message)
          }
        })
      } catch (error) {
        console.error("Error fetching application settings:", error)
        SetErrMsg("An error occurred while fetching application settings.")
      } finally {
        SetIsLoading(false)
      }
    }

    fetchData()
  }, [form])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    SetBtnLoading(true)
    console.log(data)
    const settingsPl: appSettingsPayload = {
      showMfaEnableBanner: String(data.showMfaEnableBanner),
      showQuoteOfTheDay: String(data.showQuoteOfTheDay),
      showRegisterLink: String(data.showRegisterLink),
      showResetPasswordLink: String(data.showResetPasswordLink),
    }
    SettingsService.updateAppSettings(settingsPl).then((res) => {
      if (!res.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "warn",
          message: "Modified Application Settings",
        }
        LogsService.createAuditEntry(adpl)
        setSettings(res.data)
        SetBtnLoading(false)
        SetSuccMsg("Settings updated successfully")
      } else {
        SetErrMsg(res.data.message)
      }
    })
  }

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center w-[100%] mt-10">
          <LoadingSpinner />
        </div>
      </>
    )
  } else {
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">Application Settings</h3>
              {errMsg && (
                <Alert className="mb-5" variant="destructive">
                  <InfoCircledIcon className="h-4 w-4" />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>{errMsg}</AlertDescription>
                </Alert>
              )}
              {succMsg && (
                <Alert className="mb-5" variant="success">
                  <InfoCircledIcon className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{succMsg}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="showMfaEnableBanner"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show 2fa enable banner?</FormLabel>
                        <FormDescription>
                          Wether to show the banner that prompts users to enable 2fa.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showQuoteOfTheDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show a quote of the day?</FormLabel>
                        <FormDescription>
                          Wether to show a quote of the day on the login page.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showRegisterLink"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show a register link</FormLabel>
                        <FormDescription>
                          Wether to show a register link on the login page.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showResetPasswordLink"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show a forgot password link?</FormLabel>
                        <FormDescription>
                          Wether to show a forgot password link on the login page.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button className="mr-3" type="button" variant="secondary" onClick={() => nav("/Home")}>
              Cancel
            </Button>
            <Button type="submit">
              {btnLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}Save settings..
            </Button>
          </form>
        </Form>
      </>
    )
  }
}
export default AppsettingsForm
