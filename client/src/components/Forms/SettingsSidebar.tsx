"use client"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

/**
 * Renders a sidebar with a list of links to settings pages. The active link
 * (based on the current pathname) has a different style to indicate which
 * page is currently being viewed.
 *
 * @param {SidebarNavProps} props Component props
 * @param {string} [props.className] Additional className for the outermost element
 * @param {{ href: string; title: string }[]} props.items List of links to render
 * @param {React.HTMLAttributes<HTMLElement>} [props.props] Additional props for the outermost element
 */
export function SettingsSidebar({ className, items, ...props }: SidebarNavProps) {
  const pathname = window.location.pathname
  const nav = useNavigate()

  return (
    <nav
      className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}
      {...props}
    >
      {items.map((item) => (
        <span
          key={item.href}
          onClick={() => nav(item.href)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start cursor-pointer"
          )}
        >
          {item.title}
        </span>
      ))}
    </nav>
  )
}
