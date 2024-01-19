import MfaChecker from "@/components/Auth/MfaChecker"
import RoleChecker from "@/components/Auth/RoleChecker"

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
