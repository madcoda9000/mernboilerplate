import { Separator } from "@/components/ui/separator"
import { SettingsSidebar } from "@/components/Forms/SettingsSidebar"
import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import NotifSettingsForm from "@/components/Forms/NotifSettingsForm"
import { isMobile } from "react-device-detect"

const sidebarNavItems = [
  {
    title: "Application Settings",
    href: "/Admin/AppSettings",
  },
  {
    title: "Mail Settings",
    href: "/Admin/MailSettings",
  },
  {
    title: "LDAP Settings",
    href: "/Admin/LdapSettings",
  },
  {
    title: "Notifications",
    href: "/Admin/NotifSettings",
  },
]

const NotifSettings = () => {
  return (
    <>
      <MfaChecker />
      <RoleChecker requiredRole="admins" />
      {!isMobile ? (
        <div className="hidden space-y-6 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage preferences that affect different scopes of this application.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-10 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5 border-r">
              <SettingsSidebar items={sidebarNavItems} className="pr-5" />
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <NotifSettingsForm />
            </div>
          </div>
        </div>
      ) : (
        <NotifSettingsForm />
      )}
    </>
  )
}
export default NotifSettings
