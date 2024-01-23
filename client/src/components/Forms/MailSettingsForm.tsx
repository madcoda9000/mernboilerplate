"use client"

import SettingsService from "@/Services/SettingsService"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { AuditEntryPayload, mailSettingsPayload } from "@/Interfaces/PayLoadINterfaces"
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
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "../Icons"
import { useNavigate } from "react-router-dom"
import { Input } from "../ui/input"
import LogsService from "@/Services/LogsService"

const FormSchema = z.object({
  smtpServer: z.string().min(1, {
    message: "Smtp-Server should not be empty!.",
  }),
  smtpPort: z.string().min(1, { message: "Smtp-Port should be greater than 0!." }),
  smtpUsername: z.string().min(1, {
    message: "Smtp-Username should not be empty!.",
  }),
  smtpPassword: z.string().min(1, {
    message: "Smtp-Password should not be empty!.",
  }),
  smtpTls: z.boolean(),
  smtpSenderAddress: z.string().min(1, { message: "Smtp Sender address should not be empty!" }),
})

const AppsettingsForm = () => {
  const [settings, setSettings] = useState<mailSettingsPayload | null>(null)
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const [btnLoading, SetBtnLoading] = useState<boolean>(false)
  const [errMsg, SetErrMsg] = useState<string>("")
  const [succMsg, SetSuccMsg] = useState<string>("")
  const nav = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      smtpServer: settings?.smtpServer,
      smtpPort: settings?.smtpPort,
      smtpUsername: settings?.smtpUsername,
      smtpPassword: settings?.smtpPassword,
      smtpTls: settings?.smtpTls,
      smtpSenderAddress: settings?.smtpSenderAddress,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await SettingsService.getMailSettings()
        if (!res.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "info",
            message: "Viewed Mail Settings",
          }
          LogsService.createAuditEntry(adpl)
          setSettings(res.data)
          form.setValue("smtpServer", res.data.settings.smtpServer)
          form.setValue("smtpPort", res.data.settings.smtpPort)
          form.setValue("smtpUsername", res.data.settings.smtpUsername)
          form.setValue("smtpPassword", res.data.settings.smtpPassword)
          form.setValue("smtpTls", res.data.settings.smtpTls === "true" ? true : false)
          form.setValue("smtpSenderAddress", res.data.settings.smtpSenderAddress)
        } else {
          SetErrMsg(res.data.message)
        }
      } catch (error) {
        console.error("Error fetching mail settings:", error)
        SetErrMsg("An error occurred while fetching mail settings.")
      } finally {
        SetIsLoading(false)
      }
    }

    fetchData()
  }, [form])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    SetBtnLoading(true)
    console.log(data)
    const settingsPl: mailSettingsPayload = {
      smtpServer: data.smtpServer,
      smtpPort: data.smtpPort,
      smtpUsername: data.smtpUsername,
      smtpPassword: data.smtpPassword,
      smtpTls: data.smtpTls,
      smtpSenderAddress: data.smtpSenderAddress,
    }
    SettingsService.updateMailSettings(settingsPl).then((res) => {
      if (!res.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "warn",
          message: "Modified Mail Settings",
        }
        LogsService.createAuditEntry(adpl)
        setSettings(res.data)
        SetBtnLoading(false)
        SetSuccMsg("Settings updated successfully")
      } else {
        SetErrMsg(res.data.message)
        SetBtnLoading(false)
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
              <h3 className="mb-4 text-lg font-medium">Mail Settings</h3>
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
                  name="smtpServer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">The Mailserver name</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The FQDN of your mail server. Example: mail.example.com
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
                  name="smtpUsername"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">SMTP Username</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The username used to authenticate to the SMTP server.
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
                  name="smtpPassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">SMTP Password</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The username used to authenticate to the SMTP server.
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
                  name="smtpPort"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">SMTP Port</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The port used to connect to the SMTP server.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input type="number" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage className="block" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smtpTls"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable TLS connection?</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          Wether to enable TLS connection to SMTP-Server.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smtpSenderAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Sender address</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The email address used to send mails.
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
