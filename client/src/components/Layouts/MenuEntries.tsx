class MenuEntries {
  static settingsItems: { title: string; href: string; description: string }[] = [
    {
      title: "Application Settings",
      href: "/Admin/AppSettings",
      description: "Settings that affect the whole application.",
    },
    {
      title: "Mail Settings",
      href: "/Admin/MailSettings",
      description: "Configure mailserver parameters...",
    },
    {
      title: "Notification Settings",
      href: "/Admin/NotifSettings",
      description: "Configure on which events a notification should be send.",
    },
    {
      title: "LDAP Settings",
      href: "/Admin/LdapSettings",
      description: "Configure the connection to your corporate LDAP server.",
    },
  ]

  /* define logs links arry */

  static logsItems: { title: string; href: string; description: string }[] = [
    {
      title: "Audit Logs",
      href: "/Logs/AuditLogs",
      description: "Logs regarding user actions.",
    },
    {
      title: "Request Logs",
      href: "/Logs/RequestLogs",
      description: "All Request & response logs...",
    },
    {
      title: "System Logs",
      href: "/Logs/SystemLogs",
      description: "Server related log entries.",
    },
  ]
}
export default MenuEntries
