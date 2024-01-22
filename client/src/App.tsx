import React, { Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthContextProvider } from "@/components/Auth/AuthContext"
import { ThemeProvider } from "@/components/Utils/themeProvider"
import "./index.css"

/* auth components */
import ProtectedRoute from "@/components/Auth/ProtectedRoute"

/* import Layouts */
import AuthLayout from "@/components/Layouts/AuthLayout"
import MainLayout from "@/components/Layouts/MainLayout"

/* import pages */
const Login = React.lazy(() => import("@/pages/Login"))
const Home = React.lazy(() => import("@/pages/Home"))
const Profile = React.lazy(() => import("@/pages/Profile"))
const Status404 = React.lazy(() => import("@/pages/Status/Status404"))
const Register = React.lazy(() => import("@/pages/Register"))
const ForgotPw1 = React.lazy(() => import("@/pages/ForgotPw1"))
const ForgotPw2 = React.lazy(() => import("@/pages/ForgotPw2"))
const MfaLogin = React.lazy(() => import("@/pages/MfaLogin"))
const MfaSetup = React.lazy(() => import("@/pages/MfaSetup"))
const AppSettings = React.lazy(() => import("@/pages/Admin/AppSettings"))
const MailSettings = React.lazy(() => import("@/pages/Admin/MailSettings"))
const LdapSettings = React.lazy(() => import("@/pages/Admin/LdapSettings"))
const NotifSettings = React.lazy(() => import("@/pages/Admin/NotifSettings"))
const SystemLogs = React.lazy(() => import("@/pages/Logs/SystemLogs"))
const AuditLogs = React.lazy(() => import("@/pages/Logs/AuditLogs"))
const RequestLogs = React.lazy(() => import("@/pages/Logs/RequestLogs"))

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthContextProvider>
          <Suspense fallback={<div>Loading...</div>}>
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
              </Route>
              <Route path="/Status404" element={<Status404 />} />
              <Route path="*" element={<Status404 />} />
            </Routes>
          </Suspense>
        </AuthContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
