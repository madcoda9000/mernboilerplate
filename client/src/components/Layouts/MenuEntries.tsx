/**
 * A class containing arrays of menu entries for different settings and logs.
 */
class MenuEntries {
  /**
   * An array of objects representing settings menu entries.
   * Each object has a title, href, and description property.
   */
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

  /**
   * An array of objects representing logs menu entries.
   * Each object has a title, href, and description property.
   */
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
