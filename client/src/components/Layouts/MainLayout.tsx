import { MainNav } from "@/components/Layouts/MainNav"
import UserNav from "@/components/Layouts/UserDropDown"
import { Outlet } from "react-router-dom"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { Icons } from "../Icons"
import MobileNav from "./MobileNav"
import { useIdleTimer } from "react-idle-timer"
import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../Auth/AuthContext"
import TimeoutWarningModal from "../Forms/TimeoutWarningModal"

const timeout = 300_000
const promptBeforeIdle = 30_000

export default function MainLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [open, setOpen] = useState<boolean>(false)
  const [remaining, setRemaining] = useState<string>("")
  const { logout } = useAuthContext()

  // Memoized callback functions
  const onIdle = useCallback(() => {
    setOpen(false)
    logout()
  }, [logout])

  const onActive = useCallback(() => {
    setOpen(false)
  }, [])

  const onPrompt = useCallback(() => {
    setOpen(true)
  }, [])

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500,
  })

  // Memoized interval function
  const updateRemainingTime = useCallback(() => {
    const remainingSeconds = Math.ceil(getRemainingTime() / 1000)
    let remainingDisplayString = ""
    if (remainingSeconds > 60) {
      const secs = remainingSeconds % 60
      const secStr: string = secs < 10 ? "0" + secs : String(secs)

      const mins = Math.floor(remainingSeconds / 60)
      const minsStr: string = mins < 10 ? "0" + mins : String(mins)
      remainingDisplayString = minsStr + ":" + secStr
    } else {
      remainingDisplayString = "00:" + remainingSeconds
    }
    setRemaining(remainingDisplayString)
  }, [getRemainingTime])

  useEffect(() => {
    const interval = setInterval(updateRemainingTime, 500)
    return () => clearInterval(interval)
  }, [updateRemainingTime])

  const handleStillHere = () => {
    activate()
  }

  return (
    <>
      <div className="flex flex-col min-h-screen ">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 bg-primary">
            {!isDesktop ? (
              <>
                <Sheet>
                  <SheetTrigger>
                    <Icons.hamburgerMenu className="dark:text-black text-white" />
                  </SheetTrigger>
                  <SheetContent side={"left"}>
                    <SheetHeader className="text-left"></SheetHeader>
                    <div className="mt-5">
                      <MobileNav />
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <div className="relative z-20 flex items-center text-lg font-medium text-foreground pl-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentcolor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-6 w-6 text-secondary"
                  >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                </div>
                <MainNav />
              </>
            )}
            <div className="ml-auto flex items-center space-x-4 bg-primary">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-grow p-9">
          <Outlet />
        </div>
        {isDesktop && (
          <div className="border-t fixed bottom-0 w-full">
            <div className="flex h-10 items-center px-4 bg-primary pl-9 pr-9 w-[100%]">
              <div className="w-1/3 text-gray-500">Sessiontimeout in: {remaining}</div>
              <div className="w-1/3 text-center"></div>
              <div className="w-1/3 text-end text-gray-500">fdgdh</div>
            </div>
          </div>
        )}
      </div>
      <TimeoutWarningModal isOpen={open} onClose={handleStillHere} onLogout={logout} />
    </>
  )
}
