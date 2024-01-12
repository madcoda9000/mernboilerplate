import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { cn } from "@/lib/utils"
import React from "react"

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"

export function MainNav() {
  /* define active and inactive styles */
  const inactiveLinkCss =
    "text-sm font-medium text-muted-foreground transition-colors hover:text-secondary data-[active]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-secondary data-[state=closed]:bg-transparent hover:bg-transparent bg-transparent"
  const activeLinkCss =
    "text-sm font-medium text-secondary transition-colors data-[active]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-secondary data-[state=closed]:bg-transparent data-[state=closed]:text-secondary hover:bg-transparent hover:text-secondary bg-transparent"

  /* define settings links array */
  const settingsItems: { title: string; href: string; description: string }[] = [
    {
      title: "Application Settings",
      href: "/Settings/AppSettings",
      description: "Settings that affect the whole application.",
    },
    {
      title: "Mail Settings",
      href: "/Settings/MailSettings",
      description: "Configure mailserver parameters...",
    },
    {
      title: "Notification Settings",
      href: "/Settings/NotifSettings",
      description: "Configure on which events a notification should be send.",
    },
    {
      title: "LDAP Settings",
      href: "/Settings/LdapSettings",
      description: "Configure the connection to your corporate LDAP server.",
    },
  ]

  /* define logs links arry */

  const logsItems: { title: string; href: string; description: string }[] = [
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

  return (
    <>
      <NavigationMenu className="pl-5">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href="/Home"
              className={
                window.location.pathname.includes("Home") ? activeLinkCss : inactiveLinkCss
              }
            >
              Overview
            </Link>
            <NavigationMenuContent></NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="mb-[-3px] pl-5">
            <NavigationMenuTrigger
              className={
                window.location.pathname.includes("Settings") ? activeLinkCss : inactiveLinkCss
              }
            >
              Settings
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[250px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[400px] ">
                {settingsItems.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="mb-[-3px]">
            <NavigationMenuTrigger
              className={
                window.location.pathname.includes("Logs") ? activeLinkCss : inactiveLinkCss
              }
            >
              Logs
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[250px] gap-3 p-4 md:w-[300px] md:grid-cols-1 lg:w-[300px] ">
                {logsItems.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}
