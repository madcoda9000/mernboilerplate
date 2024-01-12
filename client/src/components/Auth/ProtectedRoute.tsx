import { FC } from "react"
import { useAuthContext } from "@/components/Auth/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  accessBy: string
  request: string
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, accessBy, request }) => {
  const { user } = useAuthContext()
  if (accessBy === "non-authenticated") {
    return children
  } else if (accessBy === "authenticated") {
    try {
      if (user) {
        console.log("ProtectedRoute: AUTH:true | REQUEST: " + request + "| ACTION:" + request)
        return children
      } else {
        console.log("Protectedroute: no session user object")
        window.location.href = "/Login"
      }
    } catch (error) {
      console.log("Protectedroute: no session user object")
      window.location.href = "/Login"
    }
  }
}

export default ProtectedRoute
