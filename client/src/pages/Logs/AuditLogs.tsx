import { SystemLog, columns } from "@/components/Utils/SystemLogsColumnsDefinition"
import { DataTable } from "@/components/Utils/DataTable"
import LogsService from "@/Services/LogsService"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { useMediaQuery } from "@/components/hooks/useMediaQuery"
import { Separator } from "@/components/ui/separator"
import { SettingsSidebar } from "@/components/Forms/SettingsSidebar"
import { AuditEntryPayload } from "@/Interfaces/PayLoadINterfaces"

const sidebarNavItems = [
  {
    title: "System Logs",
    href: "/Logs/SystemLogs",
  },
  {
    title: "Audit Logs",
    href: "/Logs/AuditLogs",
  },
  {
    title: "Request Logs",
    href: "/Logs/RequestLogs",
  },
  {
    title: "Mail Logs",
    href: "/Logs/MailLogs",
  },
]

const AuditLogs = () => {
  const [data, setData] = useState<SystemLog[]>([])
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const getData = () => {
      LogsService.getAuditLogs(1, 90000, "").then((response) => {
        if (response && !response.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "info",
            message: "Viewed Audit Logs",
          }
          LogsService.createAuditEntry(adpl)
          setData(response.data.paginatedResult.docs)
          SetIsLoading(false)
        } else {
          setData([])
          SetIsLoading(false)
        }
      })
    }

    getData()
  }, [])

  return (
    <>
      <MfaChecker />
      <RoleChecker requiredRole="admins" />
      {isDesktop ? (
        <div className="hidden space-y-6 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Logs</h2>
            <p className="text-muted-foreground">
              View logs for different scopes of this application.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-10 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/6 border-r">
              <SettingsSidebar items={sidebarNavItems} className="pr-5" />
            </aside>
            <div className="flex-1 ">
              <h3 className="mb-4 text-lg font-medium ml-1">Audit Logs</h3>
              {isLoading ? (
                <>
                  <div className="flex justify-center w-[100%] mt-10">
                    <LoadingSpinner />
                  </div>
                </>
              ) : (
                <DataTable data={data} columns={columns} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <DataTable data={data} columns={columns} />
      )}
    </>
  )
}
export default AuditLogs
