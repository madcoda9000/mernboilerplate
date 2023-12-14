import RoleChecker from "../components/shared/Auth/RoleChecker";
import MfaChecker from "../components/shared/Auth/MfaChecker";

/**
 * @name Home
 * @description react Home component 
 * @returns html output for secrets listing
 */
const Home = () => {


    return (
        <>
            <MfaChecker />
            <RoleChecker requiredRole="any" />
            <>
                <div>
                    <span>dsgedfrhf</span>
                </div>
            </>
        </>
    )
}
export default Home;