import { MainNav } from "@/components/Layouts/MainNav"
import UserNav from "@/components/Layouts/UserDropDown"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <>
      <div className="flex flex-col min-h-screen ">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 bg-primary">
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
            <div className="ml-auto flex items-center space-x-4 bg-primary">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-grow p-9">
          <Outlet />
        </div>
        <div className="border-t fixed bottom-0 w-full">
          <div className="flex h-16 items-center px-4 bg-primary pl-9 text-secondary">
            Blaaaa bored footer here...
          </div>
        </div>
      </div>
    </>
  )
}
