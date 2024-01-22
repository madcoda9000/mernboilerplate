"use client"

import SettingsService from "@/Services/SettingsService"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { appSettingsPayload, notifSettingsPayload } from "@/Interfaces/PayLoadINterfaces"
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

const FormSchema = z.object({
  sendNotifOnObjectCreation: z.boolean(),
  sendNotifOnObjectDeletion: z.boolean(),
  sendNotifOnObjectUpdate: z.boolean(),
  sendNotifOnUserSelfRegister: z.boolean(),
  sendWelcomeMailOnUserCreation: z.boolean(),
})

const AppsettingsForm = () => {
  const [settings, setSettings] = useState<notifSettingsPayload | null>(null)
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const [btnLoading, SetBtnLoading] = useState<boolean>(false)
  const [errMsg, SetErrMsg] = useState<string>("")
  const [succMsg, SetSuccMsg] = useState<string>("")
  const nav = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sendNotifOnObjectCreation: settings?.sendNotifOnObjectCreation === "true" ? true : false,
      sendNotifOnObjectDeletion: settings?.sendNotifOnObjectDeletion === "true" ? true : false,
      sendNotifOnObjectUpdate: settings?.sendNotifOnObjectUpdate === "true" ? true : false,
      sendNotifOnUserSelfRegister: settings?.sendNotifOnUserSelfRegister === "true" ? true : false,
      sendWelcomeMailOnUserCreation:
        settings?.sendWelcomeMailOnUserCreation === "true" ? true : false,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await SettingsService.getNotifSettings()
        if (!res.data.error) {
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
    }
    SettingsService.updateNotifSettings(settingsPl).then((res) => {
      if (!res.data.error) {
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
