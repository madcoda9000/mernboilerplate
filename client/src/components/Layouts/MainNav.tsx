import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useNavigate } from "react-router-dom"

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
              onClick={() => nav("/Admin/Users")}
              className={
                window.location.pathname.includes("Users") ||
                window.location.pathname.includes("Roles")
                  ? activeLinkCss
                  : inactiveLinkCss
              }
            >
              Administration
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
          <NavigationMenuItem className="pl-5 cursor-pointer">
            <span
              onClick={() => nav("/Logs/SystemLogs")}
              className={
                window.location.pathname.includes("Logs") ? activeLinkCss : inactiveLinkCss
              }
            >
              Logs
            </span>
            <NavigationMenuContent></NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="pl-5 cursor-pointer">
            <span
              onClick={() => window.open(`${window.BASE_URL}/v1/doc`)}
              className={
                window.location.pathname.includes("Logs") ? activeLinkCss : inactiveLinkCss
              }
            >
              API Docs
            </span>
            <NavigationMenuContent></NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}
