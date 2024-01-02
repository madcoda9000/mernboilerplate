import { Alert, AlertIcon, Box, Button, Center, CircularProgress, HStack, Heading, PinInput, PinInputField } from "@chakra-ui/react";
import AuthContext from "../components/shared/Auth/AuthContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "../Services/UsersService";
import RoleChecker from "../components/shared/Auth/RoleChecker";
import axios from "axios";
import { makeAuditEntry } from "../components/shared/Utils";

const MfaLogin = () => {
  const { user, logout, refreshContext } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [otpToken, setOtpToken] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const [succMsg, setSuccMsg] = useState(null);
  const [activatedSuccessfully, setActivatedSuccessfully] = useState(false);

  const verifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      _id: user._id,
      token: otpToken,
    };
    UsersService.validateOtp(payload).then((response) => {
      if (response.data.error) {
        setIsLoading(false);
        setErrMsg(response.data.message);
        makeAuditEntry(user.userName, "warn", user.userName + " otp verification failed! " + response.data.message);
      } else {
        axios
          .get(window.BASE_URL + "/v1/auth/createNewAccessToken", {
            withCredentials: true,
          })
          .then((apiResponse) => {
            if (apiResponse.data.error === false) {
              sessionStorage.removeItem("user");
              sessionStorage.setItem("user", JSON.stringify(apiResponse.data.reqUser));
              refreshContext();
              setIsLoading(false);
              setErrMsg(null);
              setActivatedSuccessfully(true);
              setSuccMsg(response.data.message);
              makeAuditEntry(user.userName, "info", user.userName + " verified otp successfully!");
              var mcount = 1;
              var inv = setInterval(() => {
                if (mcount > 0) {
                  mcount = mcount - 1;
                } else {
                  goHome(inv);
                }
              }, 1000);
            } else if (apiResponse.data.error === true) {
              setErrMsg(apiResponse.data.message);
              setIsLoading(false);
            }
          });
      }
    });
  };

  function goHome(intervalId) {
    clearInterval(intervalId);
    navigate("/Home");
  }

  const handleChange = (e) => {
    //console.log(e);
    setOtpToken(e);
  };

  const cancelMfaLogin = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <>
        <RoleChecker requiredRole="any" />
        <Center width={"100%"} mt={40}>
          <CircularProgress isIndeterminate color="blue.500" />
        </Center>
      </>
    );
  } else {
    return (
      <>
        <Heading fontSize={"2xl"}>2FA Authentication</Heading>
        {errMsg && (
          <Alert status="error" colorScheme={"red"} variant={"left-accent"}>
            <AlertIcon />
            {errMsg}
          </Alert>
        )}
        {succMsg && (
          <Alert status="success" colorScheme={"gray"} variant={"left-accent"}>
            <AlertIcon />
            {succMsg}
          </Alert>
        )}

        <Box>As 2FA authentication is enabled for your account, please provide a valid OTP token.</Box>

        <form onSubmit={verifyOtp}>
          <HStack mt={"20px"} mb={"20px"}>
            <PinInput otp colorScheme="blue" autoFocus={true} onChange={(e) => handleChange(e)} isDisabled={isLoading}>
              <PinInputField mr={"30px"} ml={"10px"} />
              <PinInputField mr={"30px"} />
              <PinInputField mr={"30px"} />
              <PinInputField mr={"30px"} />
              <PinInputField mr={"30px"} />
              <PinInputField />
            </PinInput>
          </HStack>
          <HStack mt={"50px"}>
            <Button minWidth={"110px"} type="Button" onClick={() => cancelMfaLogin()} mr={"3"} display={activatedSuccessfully === false ? "block" : "none"}>
              Cancel
            </Button>
            <Button
              width={"100%"}
              type="submit"
              colorScheme={"gray"}
              variant={"solid"}
              isLoading={isLoading}
              isDisabled={isLoading}
              loadingText="verifing..."
              display={activatedSuccessfully === false ? "block" : "none"}
            >
              Verify my code now..
            </Button>
            {activatedSuccessfully === true && (
              <Button
                type="Button"
                onClick={() => navigate("/Home")}
                width={"100%"}
                colorScheme={"green"}
                isLoading={true}
                loadingText={"loading start page..."}
              >
                loading start page...
              </Button>
            )}
          </HStack>
        </form>
      </>
    );
  }
};
export default MfaLogin;
