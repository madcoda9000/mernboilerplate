"use client"

import SettingsService from "@/Services/SettingsService"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { ldapSettingsPayload } from "@/Interfaces/PayLoadINterfaces"
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

const FormSchema = z.object({
  ldapBaseDn: z.string().min(1, {
    message: "Base-DN should not be empty!.",
  }),
  ldapDomainController: z.string().min(1, {
    message: "Domaincontroller should not be emnpty!.",
  }),
  ldapDomainName: z.string().min(1, {
    message: "Domainname should not be empty!.",
  }),
  ldapGroup: z.string().min(1, {
    message: "AD Groupname should not be empty!.",
  }),
  ldapEnabled: z.boolean(),
})

const LdapSettingsForm = () => {
  const [settings, setSettings] = useState<ldapSettingsPayload | null>(null)
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const [btnLoading, SetBtnLoading] = useState<boolean>(false)
  const [errMsg, SetErrMsg] = useState<string>("")
  const [succMsg, SetSuccMsg] = useState<string>("")
  const nav = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ldapBaseDn: settings?.ldapBaseDn,
      ldapDomainController: settings?.ldapDomainController,
      ldapDomainName: settings?.ldapDomainName,
      ldapEnabled: settings?.ldapEnabled,
      ldapGroup: settings?.ldapGroup,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await SettingsService.getLdapSettings()
        if (!res.data.error) {
          setSettings(res.data)
          form.setValue("ldapBaseDn", res.data.settings.ldapBaseDn)
          form.setValue("ldapDomainController", res.data.settings.ldapDomainController)
          form.setValue("ldapDomainName", res.data.settings.ldapDomainName)
          form.setValue("ldapEnabled", res.data.settings.ldapEnabled === "true" ? true : false)
          form.setValue("ldapGroup", res.data.settings.ldapGroup)
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
    const settingsPl: ldapSettingsPayload = {
      ldapBaseDn: data.ldapBaseDn,
      ldapDomainController: data.ldapDomainController,
      ldapDomainName: data.ldapDomainName,
      ldapEnabled: data.ldapEnabled,
      ldapGroup: data.ldapGroup,
    }
    SettingsService.updateLdapSettings(settingsPl).then((res) => {
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
              <h3 className="mb-4 text-lg font-medium">Ldap Settings</h3>
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
                  name="ldapBaseDn"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">The Base DN</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The distinguished name of the base domain entry.
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
                  name="ldapDomainController"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Domaincontroller</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The fqdn of the domaincontroller.
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
                  name="ldapDomainName"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Domain name</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The name of the domain.
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
                  name="ldapGroup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ldap Group</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          The name of the group a user must be in to be able to login.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage className="block" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ldapEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Ldap?</FormLabel>
                        <FormDescription className="w-[200px] pr-3">
                          Wether to enable Ldap login or not.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
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
export default LdapSettingsForm
