"use client"

import SettingsService from "@/Services/SettingsService"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { AuditEntryPayload, notifSettingsPayload } from "@/Interfaces/PayLoadINterfaces"
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
import { Input } from "@/components/ui/input"
import { Icons } from "../Icons"
import { useNavigate } from "react-router-dom"
import LogsService from "@/Services/LogsService"
import { isMobile } from "react-device-detect"

const FormSchema = z.object({
  sendNotifOnObjectCreation: z.boolean(),
  sendNotifOnObjectDeletion: z.boolean(),
  sendNotifOnObjectUpdate: z.boolean(),
  sendNotifOnUserSelfRegister: z.boolean(),
  sendWelcomeMailOnUserCreation: z.boolean(),
  notifReceiver: z.string().min(1, {
    message: "Notification receiver email should not be empty!.",
  }),
  notifReciverFirstname: z.string().min(1, {
    message: "Notification receiver firstname should not be empty!.",
  }),
  notifReceiverLastname: z.string().min(1, {
    message: "Notificationreceiver lastname should not be empty!.",
  }),
})

const AppsettingsForm = () => {
  const [settings, setSettings] = useState<notifSettingsPayload | null>(null)
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const [btnLoading, SetBtnLoading] = useState<boolean>(false)
  const [errMsg, SetErrMsg] = useState<string>("")
  const [succMsg, SetSuccMsg] = useState<string>("")
  const nav = useNavigate()
  const [desktopFrameCss, setDesktopFrameCss] = useState<string>(
    "flex flex-row items-center justify-between rounded-lg border p-4"
  )
  const [descrCss, setDescrCss] = useState<string>("w-[200px] pr-3")

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sendNotifOnObjectCreation: settings?.sendNotifOnObjectCreation === "true" ? true : false,
      sendNotifOnObjectDeletion: settings?.sendNotifOnObjectDeletion === "true" ? true : false,
      sendNotifOnObjectUpdate: settings?.sendNotifOnObjectUpdate === "true" ? true : false,
      sendNotifOnUserSelfRegister: settings?.sendNotifOnUserSelfRegister === "true" ? true : false,
      sendWelcomeMailOnUserCreation:
        settings?.sendWelcomeMailOnUserCreation === "true" ? true : false,
      notifReceiver: settings?.notifReceiver,
      notifReciverFirstname: settings?.notifReciverFirstname,
      notifReceiverLastname: settings?.notifReceiverLastname,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isMobile) {
          setDesktopFrameCss("rounded-lg border p-4")
          setDescrCss("w-[100%]")
        } else {
          setDesktopFrameCss("flex flex-row items-center justify-between rounded-lg border p-4")
          setDescrCss("w-[200px] pr-3")
        }
        const res = await SettingsService.getNotifSettings()
        if (!res.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "info",
            message: "Viewed Notification Settings",
          }
          LogsService.createAuditEntry(adpl)
          setSettings(res.data)
          form.setValue(
            "sendNotifOnObjectCreation",
            res.data.settings.sendNotifOnObjectCreation === "true" ? true : false
          )
          form.setValue(
            "sendNotifOnObjectDeletion",
            res.data.settings.sendNotifOnObjectDeletion === "true" ? true : false
          )
          form.setValue(
            "sendNotifOnObjectUpdate",
            res.data.settings.sendNotifOnObjectUpdate === "true" ? true : false
          )
          form.setValue(
            "sendNotifOnUserSelfRegister",
            res.data.settings.sendNotifOnUserSelfRegister === "true" ? true : false
          )
          form.setValue(
            "sendWelcomeMailOnUserCreation",
            res.data.settings.sendWelcomeMailOnUserCreation === "true" ? true : false
          )
          form.setValue("notifReceiver", res.data.settings.notifReceiver)
          form.setValue("notifReciverFirstname", res.data.settings.notifReciverFirstname)
          form.setValue("notifReceiverLastname", res.data.settings.notifReceiverLastname)
        } else {
          SetErrMsg(res.data.message)
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error)
        SetErrMsg("An error occurred while fetching notification settings.")
      } finally {
        SetIsLoading(false)
      }
    }

    fetchData()
  }, [form])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    SetBtnLoading(true)
    console.log(data)
    const settingsPl: notifSettingsPayload = {
      sendNotifOnObjectCreation: String(data.sendNotifOnObjectCreation),
      sendNotifOnObjectDeletion: String(data.sendNotifOnObjectDeletion),
      sendNotifOnObjectUpdate: String(data.sendNotifOnObjectUpdate),
      sendNotifOnUserSelfRegister: String(data.sendNotifOnUserSelfRegister),
      sendWelcomeMailOnUserCreation: String(data.sendWelcomeMailOnUserCreation),
      notifReceiver: String(data.notifReceiver),
      notifReciverFirstname: String(data.notifReciverFirstname),
      notifReceiverLastname: String(data.notifReceiverLastname),
    }
    SettingsService.updateNotifSettings(settingsPl).then((res) => {
      if (!res.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "warn",
          message: "Modified Notification Setting",
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
              <h3 className="mb-4 text-lg font-medium">Notification Settings</h3>
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
                  name="sendNotifOnObjectCreation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Object creation</FormLabel>
                        <FormDescription>
                          Wether to send a notification on object (user, role) creation or not?
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
                  name="sendNotifOnObjectDeletion"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Object deletion</FormLabel>
                        <FormDescription>
                          Wether to send a notification on object (user, role) deletion or not?
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
                  name="sendNotifOnObjectUpdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Object update</FormLabel>
                        <FormDescription>
                          Wether to send a notification on object (user, role) update or not?
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
                  name="sendNotifOnUserSelfRegister"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Self register</FormLabel>
                        <FormDescription>
                          Wether to send a notification on user self registration or not?
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
                  name="sendWelcomeMailOnUserCreation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">User creation</FormLabel>
                        <FormDescription>
                          Wether to send a notification on user creation by an adfmin or not?
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
                  name="notifReceiver"
                  render={({ field }) => (
                    <FormItem className={desktopFrameCss}>
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Notification receiver email address
                        </FormLabel>
                        <FormDescription className={descrCss}>
                          The email address used to send notifications to.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notifReciverFirstname"
                  render={({ field }) => (
                    <FormItem className={desktopFrameCss}>
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notification receiver firstname</FormLabel>
                        <FormDescription className={descrCss}>
                          The firstname of the notification receiver.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notifReceiverLastname"
                  render={({ field }) => (
                    <FormItem className={desktopFrameCss}>
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notification receiver lastname</FormLabel>
                        <FormDescription className={descrCss}>
                          The lastname of the notification receiver.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
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
