import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"

/**
 * Renders the Home component with RoleChecker and MfaChecker components.
 *
 * @return {JSX.Element} The rendered Home component
 */
const Home: React.FC = () => {
  return (
    <>
      <RoleChecker requiredRole="any" />
      <MfaChecker />
      <span>Home!</span>
    </>
  )
}

export default Home
