"use client"

import { AuditEntryPayload } from "@/Interfaces/PayLoadINterfaces"
import LogsService from "@/Services/LogsService"
import UsersService from "@/Services/UsersService"
import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"
import { useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { User } from "@/Interfaces/GlobalInterfaces"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { SettingsSidebar } from "@/components/Forms/SettingsSidebar"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Icons } from "@/components/Icons"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const sidebarNavItems = [
  {
    title: "Users",
    href: "/Admin/Users",
  },
  {
    title: "Roles",
    href: "/Admin/Roles",
  },
]

const Users = () => {
  const [data, setData] = useState<User[]>([])
  const [isLoading, SetIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getData = () => {
      UsersService.getUsersPaginated(1, 90000, "").then((response) => {
        if (response && !response.data.error) {
          const adpl: AuditEntryPayload = {
            user: JSON.parse(sessionStorage.getItem("user")!).userName,
            level: "info",
            message: "Viewed Users",
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

  const showToast = (typ: string, message: string) => {
    const date = new Date()
    if (typ === "info") {
      toast.info(message, {
        description:
          date.toLocaleDateString("en-EN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }) +
          " at " +
          date.toLocaleTimeString("en-EN", { hour: "2-digit", minute: "2-digit" }),
      })
    } else if (typ === "success") {
      toast.success(message, {
        description:
          date.toLocaleDateString("en-EN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }) +
          " at " +
          date.toLocaleTimeString("en-EN", { hour: "2-digit", minute: "2-digit" }),
      })
    } else if (typ === "error") {
      toast.error(message, {
        description:
          date.toLocaleDateString("en-EN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }) +
          " at " +
          date.toLocaleTimeString("en-EN", { hour: "2-digit", minute: "2-digit" }),
      })
    }
  }

  const copyUsernameToClpd = (username: string) => {
    navigator.clipboard.writeText(username)
    showToast("success", "Username copied to clippoard successfully!")
  }

  const getData = () => {
    SetIsLoading(true)
    UsersService.getUsersPaginated(1, 90000, "").then((response) => {
      if (response && !response.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "info",
          message: "Viewed Users",
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

  const handleMfaEnforcement = (user: User) => {
    UsersService.updateUser(user._id, { mfaEnforced: !user.mfaEnforced }).then((response) => {
      if (response && !response.data.error) {
        const adpl: AuditEntryPayload = {
          user: JSON.parse(sessionStorage.getItem("user")!).userName,
          level: "info",
          message: `Toggled MFA enforcement for ${user.userName}`,
        }
        LogsService.createAuditEntry(adpl)
      }
    })
  }

  if (isLoading) {
    return (
      <>
        <MfaChecker />
        <RoleChecker requiredRole="admins" />
        <div className="flex justify-center w-[100%] mt-10">
          <LoadingSpinner />
        </div>
      </>
    )
  } else {
    return (
      <>
        <MfaChecker />
        <RoleChecker requiredRole="admins" />
        {!isMobile ? (
          <>
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
                <div className="flex-1 lg:max-w-4xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Acc</TableHead>
                        <TableHead className="text-left">Mfa</TableHead>
                        <TableHead className="text-left">MfaEnf</TableHead>
                        <TableHead className="text-left">email</TableHead>
                        <TableHead className="text-left">username</TableHead>
                        <TableHead className="text-left">actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((user: User) => (
                        <TableRow key={user._id}>
                          <TableCell className="text-left">
                            {user.accountLocked ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Icons.circleCross
                                    className="inline mr-3 text-destructive cursor-pointer"
                                    title="activate account"
                                    onClick={() =>
                                      showToast("info", "Account activated successfully.")
                                    }
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Activate account</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Icons.circleCheck
                                    className="inline mr-3 text-success cursor-pointer"
                                    title="activate account"
                                    onClick={() =>
                                      showToast("info", "Account deactivated successfully.")
                                    }
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Deactivate account</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell className="text-left">
                            {user.mfaEnabled ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Icons.circleCheck
                                    className="inline mr-3 text-success cursor-pointer"
                                    title="Disable 2FA Authentication"
                                    onClick={() =>
                                      showToast("info", "2FA Authenticationt disabled")
                                    }
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Disable 2FA Authentication</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Icons.circleCross
                                className="inline mr-3 text-destructive"
                                title="2FA Auth disabled"
                              />
                            )}
                          </TableCell>
                          <TableCell className="text-left">
                            {user.mfaEnforced ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Icons.circleCheck
                                    className="inline mr-3 text-warning cursor-pointer"
                                    title="2FA Authentication enforced"
                                    onClick={() => showToast("info", "2FA enforcement disabled")}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to disable 2FA enforcement.</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Icons.circleCross
                                    className="inline mr-3 text-default cursor-pointer"
                                    title="Click to enforce 2FA Authentication"
                                    onClick={() => showToast("info", "2FA enforcement enabled")}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to enforce 2FA Authentication</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell className="text-left">{user.email}</TableCell>
                          <TableCell className="text-left">{user.userName}</TableCell>
                          <td className="text-left">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">...</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  {user.firstName}&nbsp;{user.lastName}
                                </DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => copyUsernameToClpd(user.userName)}>
                                  <Icons.clipboardCopy className="inline mr-3" />
                                  Copy user name
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => navigate("/Admin/EditUser/" + user._id)}
                                >
                                  <Icons.pencil className="inline mr-3" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {user.accountLocked === true ? (
                                    <>
                                      <Icons.lockOpen className="inline mr-3" />
                                      Unlock User
                                    </>
                                  ) : (
                                    <>
                                      <Icons.lockOpen className="inline mr-3" />
                                      Lock User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Icons.circleCross className="inline mr-3" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <span>Mobile view!</span>
          </>
        )}
      </>
    )
  }
}
export default Users
