import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const MfaChecker: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const userString = sessionStorage.getItem("user")

    if (userString) {
      try {
        const decodedToken = JSON.parse(userString)

        console.log("MFACHECK: fetched user from session storage")
        console.log(
          `MFACHECK: mfaEnabled: ${decodedToken.mfaEnabled} | mfaEnforced: ${decodedToken.mfaEnforced} | mfaVerified: ${decodedToken.mfaVerified}`
        )

        if (decodedToken.mfaEnabled === true && decodedToken.mfaVerified === undefined) {
          navigate("/MfaLogin")
        }

        if (decodedToken.mfaEnabled === true && decodedToken.mfaVerified === false) {
          navigate("/MfaLogin")
        }

        if (
          decodedToken.mfaEnabled === false &&
          decodedToken.mfaVerified === false &&
          decodedToken.mfaEnforced === true
        ) {
          navigate("/MfaSetup")
        }
      } catch (error) {
        console.error("MFACHECK: Error parsing user from session storage", error)
        navigate("/login")
      }
    } else {
      console.log("MFACHECK: fetching user from session storage failed!")
      navigate("/login")
    }
  }, [navigate])

  return null // or you can return a loading indicator if needed
}

export default MfaChecker
