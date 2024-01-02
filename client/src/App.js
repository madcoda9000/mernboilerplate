// 1. import `ChakraProvider` component
import { Center, ChakraProvider, CircularProgress, ColorModeScript, extendTheme } from "@chakra-ui/react";
import theme from "./components/Layouts/Theme";

// main imports
import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// auth components
import { AuthContextProvider } from "./components/shared/Auth/AuthContext";
import ProtectedRoute from "./components/shared/Auth/ProtectedRoute";

import AuthLayout from "./components/Layouts/AuthLayout";
import Layout from "./components/Layouts/MainLayout";

// pages
const UsersEdit = React.lazy(() => import("./pages/Admin/UsersEdit"));
const UserNew = React.lazy(() => import("./pages/Admin/UserNew"));
const RoleNew = React.lazy(() => import("./pages/Admin/RoleNew"));
const Login = React.lazy(() => import("./pages/Login"));
const MfaLogin = React.lazy(() => import("./pages/MfaLogin"));
const MfaSetup = React.lazy(() => import("./pages/MfaSetup"));
const ForgotPw1 = React.lazy(() => import("./pages/ForgotPw1"));
const ForgotPw2 = React.lazy(() => import("./pages/ForgotPw2"));
const Home = React.lazy(() => import("./pages/Home"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Register = React.lazy(() => import("./pages/register"));
const Users = React.lazy(() => import("./pages/Admin/Users"));
const Roles = React.lazy(() => import("./pages/Admin/Roles"));
const AppSettings = React.lazy(() => import("./pages/Admin/AppSettings"));
const AuditLogs = React.lazy(() => import("./pages/Admin/AuditLogs"));
const SystemLogs = React.lazy(() => import("./pages/Admin/SystemLogs"));
const RequestLogs = React.lazy(() => import("./pages/Admin/RequestLogs"));
const ConfirmEmail = React.lazy(() => import("./pages/confirmEmail"));
const Status403 = React.lazy(() => import("./pages/Status/Status403"));
const Status400 = React.lazy(() => import("./pages/Status/Status400"));
const Status404 = React.lazy(() => import("./pages/Status/Status404"));
const Status429 = React.lazy(() => import("./pages/Status/Status429"));
const StatusNoAPI = React.lazy(() => import("./pages/Status/StatusNoAPI"));

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <AuthContextProvider>
            <Suspense
              fallback={
                <Center width={"100%"} mt={40}>
                  <CircularProgress isIndeterminate color="blue.500" />
                </Center>
              }
            >
              <Routes>
                <Route element={<AuthLayout />}>
                  <Route
                    exact
                    path="/"
                    element={
                      <ProtectedRoute accessBy="non-authenticated" request="/login">
                        <Login />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/login/:msgType?"
                    element={
                      <ProtectedRoute accessBy="non-authenticated" request="/login">
                        <Login />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/MfaLogin"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/MfaLogin">
                        <MfaLogin />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/MfaSetup"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/MfaSetup">
                        <MfaSetup />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/ForgotPw1"
                    element={
                      <ProtectedRoute accessBy="non-authenticated" request="/ForgotPw1">
                        <ForgotPw1 />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/ForgotPw2"
                    element={
                      <ProtectedRoute accessBy="non-authenticated" request="/ForgotPw2">
                        <ForgotPw2 />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/Register"
                    element={
                      <ProtectedRoute accessBy="non-authenticated" request="/register">
                        <Register />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/confirmEmail"
                    element={
                      <ProtectedRoute accessBy="non-authenticated" request="/confirmEmail">
                        <ConfirmEmail />
                      </ProtectedRoute>
                    }
                  ></Route>
                </Route>

                <Route element={<Layout />}>
                  <Route
                    path="/Admin/UserNew"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Admin/UserNew">
                        <UserNew />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/Admin/RoleNew"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Admin/RoleNew">
                        <RoleNew />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/Admin/UsersEdit/:id"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Admin/UsersEdit">
                        <UsersEdit />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/Admin/AuditLogs"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Admin/AuditLogs">
                        <AuditLogs />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/Admin/SystemLogs"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Admin/SystemLogs">
                        <SystemLogs />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/Admin/RequestLogs"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Admin/RequstLogs">
                        <RequestLogs />
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
                    exact
                    path="/Home"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Home">
                        <Home />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/Profile"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Profile">
                        <Profile />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/Admin/Users"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Admin/Users">
                        <Users />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    exact
                    path="/Admin/Roles"
                    element={
                      <ProtectedRoute accessBy="authenticated" request="/Admin/Roles">
                        <Roles />
                      </ProtectedRoute>
                    }
                  ></Route>
                </Route>

                <Route path="/Status403" Component={Status403}></Route>
                <Route path="/Status400" Component={Status400}></Route>
                <Route path="/Status404" Component={Status404}></Route>
                <Route path="/Status429" Component={Status429}></Route>
                <Route path="/StatusNoAPI" Component={StatusNoAPI}></Route>
                <Route path="*" Component={Status404} />
              </Routes>
            </Suspense>
          </AuthContextProvider>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
}
export default App;
