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
