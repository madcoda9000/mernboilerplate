import { Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthContextProvider } from "@/components/Auth/AuthContext"
import { ThemeProvider } from "@/components/Utils/themeProvider"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import "./index.css"

/* auth components */
import ProtectedRoute from "@/components/Auth/ProtectedRoute"

/* import Layouts */
import AuthLayout from "@/components/Layouts/AuthLayout"
import MainLayout from "@/components/Layouts/MainLayout"

/* import pages */
import Login from "@/pages/Login"
import Home from "@/pages/Home"
import Profile from "@/pages/Profile"
import Status404 from "@/pages/Status/Status404"
import Status403 from "@/pages/Status/Status403"
import Status429 from "@/pages/Status/Status429"
import Register from "@/pages/Register"
import ForgotPw1 from "@/pages/ForgotPw1"
import ForgotPw2 from "@/pages/ForgotPw2"
import MfaLogin from "@/pages/MfaLogin"
import MfaSetup from "@/pages/MfaSetup"
import AppSettings from "@/pages/Admin/AppSettings"
import MailSettings from "@/pages/Admin/MailSettings"
import LdapSettings from "@/pages/Admin/LdapSettings"
import NotifSettings from "@/pages/Admin/NotifSettings"
import SystemLogs from "@/pages/Logs/SystemLogs"
import AuditLogs from "@/pages/Logs/AuditLogs"
import MailLogs from "@/pages/Logs/MailLogs"
import RequestLogs from "@/pages/Logs/RequestLogs"
import Privacy from "@/pages/Privacy"
import Users from "@/pages/Admin/Users"
import EditUser from "@/pages/Admin/EditUser"
import NewUser from "@/pages/Admin/NewUser"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthContextProvider>
          <Suspense
            fallback={
              <div className="flex justify-center w-[100%] mt-10">
                <LoadingSpinner />
              </div>
            }
          >
            <Routes>
              <Route element={<AuthLayout />}>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute accessBy="non-authenticated" request="/">
                      <Login />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Login/:msgType?"
                  element={
                    <ProtectedRoute accessBy="non-authenticated" request="/Login">
                      <Login />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Register"
                  element={
                    <ProtectedRoute accessBy="non-authenticated" request="/Register">
                      <Register />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/ForgotPw1"
                  element={
                    <ProtectedRoute accessBy="non-authenticated" request="/ForgotPw1">
                      <ForgotPw1 />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/ForgotPw2"
                  element={
                    <ProtectedRoute accessBy="non-authenticated" request="/ForgotPw2">
                      <ForgotPw2 />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/MfaLogin"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/MfaLogin">
                      <MfaLogin />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/MfaSetup"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/MfaSetup">
                      <MfaSetup />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/privacy"
                  element={
                    <ProtectedRoute accessBy="non-authenticated" request="/privacy">
                      <Privacy />
                    </ProtectedRoute>
                  }
                ></Route>
              </Route>
              <Route element={<MainLayout />}>
                <Route
                  path="/Home"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Home">
                      <Home />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Profile"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Profile">
                      <Profile />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Admin/AppSettings"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Admin/AppSettings">
                      <AppSettings />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Admin/MailSettings"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Admin/MailSettings">
                      <MailSettings />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Admin/LdapSettings"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Admin/LdapSettings">
                      <LdapSettings />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Admin/NotifSettings"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Admin/NotifSettings">
                      <NotifSettings />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Logs/SystemLogs"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Logs/SystemLogs">
                      <SystemLogs />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Logs/MailLOgs"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Logs/MailLOgs">
                      <MailLogs />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Logs/AuditLogs"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Logs/AuditLogs">
                      <AuditLogs />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Logs/RequestLogs"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Logs/RequestLogs">
                      <RequestLogs />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Admin/Users"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Admin/Users">
                      <Users />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Admin/EditUser/:userId"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Admin/EditUser">
                      <EditUser />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/Admin/NewUser"
                  element={
                    <ProtectedRoute accessBy="authenticated" request="/Admin/NewUser">
                      <NewUser />
                    </ProtectedRoute>
                  }
                ></Route>
              </Route>
              <Route path="/Status404" element={<Status404 />} />
              <Route path="/Status403" element={<Status403 />} />
              <Route path="/Status429" element={<Status429 />} />
              <Route path="*" element={<Status404 />} />
            </Routes>
          </Suspense>
        </AuthContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
