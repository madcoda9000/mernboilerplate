import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface RoleCheckerProps {
  requiredRole: string
}

/**
 * A React functional component that checks the user's roles and navigates based on the required role.
 * It retrieves the user from session storage, parses their roles, and compares them to the required role.
 * If the user is not found or if their role does not match the required role, it redirects them to appropriate pages.
 *
 * @param {RoleCheckerProps} props - The properties passed to the component.
 * @param {string} props.requiredRole - The role required to access the component. Use 'any' to allow all roles.
 *
 * @return {null} This component does not render anything; it only performs navigation.
 */
const RoleChecker: React.FC<RoleCheckerProps> = (props) => {
  const navigate = useNavigate()

  useEffect(() => {
    const userString = sessionStorage.getItem("user")

    if (userString) {
      try {
        const decodedToken = JSON.parse(userString)

        console.log("ROLECHECK: fetched user from session storage")
        console.log(
          `ROLECHECK: ForcedRole: ${props.requiredRole} | UserRoles: ${decodedToken.roles}`
        )

        if (!decodedToken) {
          navigate("/login")
        }

        if (props.requiredRole !== "any" && !decodedToken.roles.includes(props.requiredRole)) {
          navigate("/Status403")
        }
      } catch (error) {
        console.error("ROLECHECK: Error parsing user from session storage", error)
        navigate("/login")
      }
    } else {
      console.log("ROLECHECK: fetching user from session storage failed!")
      navigate("/login")
    }
  }, [navigate, props.requiredRole])

  return null // or you can return a loading indicator if needed
}

export default RoleChecker
