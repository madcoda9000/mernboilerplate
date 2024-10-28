import { FC } from "react"
import { useAuthContext } from "@/components/Auth/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  accessBy: string
  request: string
}

/**
 * This component is used to protect routes from unauthorized access.
 *
 * @param {React.ReactNode} children - The components to be rendered
 * @param {string} accessBy - The type of access required, either "non-authenticated" or "authenticated"
 * @param {string} request - The request to be made
 *
 * @returns {React.ReactElement} The protected route component
 */
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
