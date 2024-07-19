import { FC } from "react"
import { useAuthContext } from "@/components/Auth/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  accessBy: string
  request: string
}

/**
 * Renders the protected route component.
 *
 * @param {ProtectedRouteProps} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to render.
 * @param {string} props.accessBy - The access level required for the route.
 * @param {string} props.request - The request type.
 * @return {React.ReactNode} The rendered component.
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
