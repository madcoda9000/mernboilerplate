import { useContext, useRef, useState, useEffect } from "react";
import { Link as ReactRouterLink, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthContext from "../components/shared/Auth/AuthContext";
import { Button, FormControl, FormLabel, Heading, Input, Stack, Alert, Link as ChakraLink, AlertIcon } from "@chakra-ui/react";
import SettingsService from "../Services/SettingsService";

/**
 * @name Login
 * @description react Login component
 * @returns html output for login page
 */
const Login = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const userName = useRef("");
  const password = useRef("");
  const [aSettings, setAsettings] = useState(null);
  const { login } = useContext(AuthContext);
  const [errMsg, steErrMsg] = useState("");
  const [searchParams] = useSearchParams();

  const validate = () => {
    var hasErrors = false;
    let msg = "";

    if (!msg === "") {
      msg = "";
    }
    if (userName.current.value.trim() === "") {
      hasErrors = true;
      if (hasErrors) {
        msg = msg + "Username is mandatory! ";
      }
    }
    if (password.current.value.trim() === "") {
      console.log(msg);
      hasErrors = true;
      if (hasErrors) {
        msg = msg + "A password is mandatory!";
      }
    }
    steErrMsg(msg);
    return hasErrors;
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validate()) {
      let payload = {
        userName: userName.current.value,
        password: password.current.value,
      };
      let erg = await login(payload);
      if (erg !== "") {
        steErrMsg(erg);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // remove all tokens
      if (sessionStorage.getItem("accessToken")) {
        sessionStorage.removeItem("accessToken");
      }
      if (sessionStorage.getItem("refreshToken")) {
        sessionStorage.removeItem("refreshToken");
      }
      if (localStorage.getItem("AppSettings")) {
        localStorage.removeItem("AppSettings");
      }

      SettingsService.getApplicationSettings().then((response) => {
        localStorage.setItem("AppSettings", JSON.stringify(response.data.settings));
        setAsettings(JSON.parse(localStorage.getItem("AppSettings")));
      });

      setIsLoading(false);
    }, 0);
  }, []);

  if (aSettings && aSettings.showMfaEnableBanner === "true") {
    sessionStorage.setItem("showBanner", true);
  } else if (aSettings && aSettings.showMfaEnableBanner === "false") {
    if (sessionStorage.getItem("showBanner")) {
      sessionStorage.removeItem("showBanner");
    }
  }

  return (
    <>
      <>
        <Heading fontSize={"2xl"}>Sign in to your account</Heading>
        {searchParams.get("msg") === "sess" && (
          <Alert status="info" colorScheme={"gray"} variant={"left-accent"}>
            <AlertIcon />
            <span>Due to security reasons, your session was terminated automatically.</span>
          </Alert>
        )}
        {searchParams.get("msg") === "lgo" && (
          <Alert status="info" colorScheme={"gray"} variant={"left-accent"}>
            <AlertIcon />
            <span>You're logged out successfully.</span>
          </Alert>
        )}
        {searchParams.get("msg") === "reg" && (
          <Alert status="info" colorScheme={"gray"} variant={"left-accent"}>
            <AlertIcon />
            <span>Your account was created successfully. Please take a look into your inbox to verify your email addres.</span>
          </Alert>
        )}
        {searchParams.get("msg") === "conf" && (
          <Alert status="info" colorScheme={"gray"} variant={"left-accent"}>
            <AlertIcon />
            <span>Your email address is confirmed successfully and your account is activated. You can login now using your credentials.</span>
          </Alert>
        )}
        {searchParams.get("msg") === "res" && (
          <Alert status="info" colorScheme={"gray"} variant={"left-accent"}>
            <AlertIcon />
            <span>Your password was resetted successfully. You can login now using your new password.</span>
          </Alert>
        )}
        {errMsg && (
          <Alert status="error" colorScheme={"red"} variant={"left-accent"}>
            <AlertIcon />
            {errMsg}
          </Alert>
        )}
        <form onSubmit={loginSubmit}>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input type="text" ref={userName} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" ref={password} />
          </FormControl>
          <Stack spacing={6}>
            <Button type="submit" colorScheme={"gray"} variant={"solid"} isLoading={isLoading} loadingText="Submitting" marginTop={"10"}>
              Sign in
            </Button>
          </Stack>
          <Stack
            display={aSettings && aSettings.showResetPasswordLink === "true" ? "flex" : "none"}
            direction={{ base: "column", sm: "row" }}
            align={"center"}
            justifyContent={"center"}
            marginTop={"20"}
          >
            <ChakraLink as={ReactRouterLink} to="/ForgotPw1" color={"gary.500"}>
              Forgot password?
            </ChakraLink>
          </Stack>
          <Stack
            display={aSettings && aSettings.showRegisterLink === "true" ? "flex" : "none"}
            direction={{ base: "column", sm: "row" }}
            align={"center"}
            justifyContent={"center"}
            marginTop={aSettings && aSettings.showResetPasswordLink === "true" ? "5" : "20"}
          >
            <ChakraLink as={ReactRouterLink} to="/register" color={"gary.500"}>
              Register new Account?
            </ChakraLink>
          </Stack>
        </form>
      </>
    </>
  );
};
export default Login;
