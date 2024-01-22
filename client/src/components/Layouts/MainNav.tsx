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
import MenuEntries from "@/components/Layouts/MenuEntries"
import { useNavigate } from "react-router-dom"

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
  const nav = useNavigate()
  /* define active and inactive styles */
  const inactiveLinkCss =
    "text-sm font-medium text-muted-foreground transition-colors hover:text-secondary data-[active]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-secondary data-[state=closed]:bg-transparent hover:bg-transparent bg-transparent"
  const activeLinkCss =
    "text-sm font-medium text-secondary transition-colors data-[active]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-secondary data-[state=closed]:bg-transparent data-[state=closed]:text-secondary hover:bg-transparent hover:text-secondary bg-transparent"

  return (
    <>
      <NavigationMenu className="pl-5">
        <NavigationMenuList>
          <NavigationMenuItem className="cursor-pointer">
            <span
              onClick={() => nav("/Home")}
              className={
                window.location.pathname.includes("Home") ? activeLinkCss : inactiveLinkCss
              }
            >
              Overview
            </span>
            <NavigationMenuContent></NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="pl-5 cursor-pointer">
            <span
              onClick={() => nav("/Admin/AppSettings")}
              className={
                window.location.pathname.includes("Settings") ? activeLinkCss : inactiveLinkCss
              }
            >
              Settings
            </span>
            <NavigationMenuContent></NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="mb-[-3px] cursor-pointer">
            <NavigationMenuTrigger
              className={
                window.location.pathname.includes("Logs") ? activeLinkCss : inactiveLinkCss
              }
            >
              Logs
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[250px] gap-3 p-4 md:w-[300px] md:grid-cols-1 lg:w-[300px] ">
                {MenuEntries.logsItems.map((component) => (
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
