import { useContext, useRef, useState, useEffect } from "react";
import { Link as ReactRouterLink, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthContext from "../components/shared/Auth/AuthContext";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Alert,
  Link as ChakraLink,
  AlertIcon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import SettingsService from "../Services/SettingsService";
import { MdRefresh, MdRemoveRedEye } from "react-icons/md";
import password from "secure-random-password";
import { PasswordChecker } from "react-password-strengthbar-ui";
import UsersService from "../Services/UsersService";

const ForgotPw2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState();
  const [email, setEmail] = useState();
  const [newPw, setNewPw] = useState("");
  const [btnDisbled, setBtnDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pwStrengthData, setPwStrengthData] = useState();
  const getPasswordData = (data) => {
    setPwStrengthData(data);
  };

  useEffect(() => {
    if (searchParams.get("email") === null || searchParams.get("token") === null) {
      setErrMsg({ __html: "Invalid email and /or token!" });
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
      setToken(searchParams.get("token"));
      setEmail(searchParams.get("email"));
      setErrMsg(null);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { value } = e.target;
    setNewPw(value);
  };

  const handleGeneratePassword = () => {
    const generatedPassword = password.randomPassword({ length: 16, characters: [password.lower, password.upper, password.digits, password.symbols] });
    setNewPw(generatedPassword);
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    let hasError = false;
    let msg = "<ul style='margin-left:20px;'>";

    const addError = (message) => {
      hasError = true;
      msg += `<li>${message}</li>`;
    };

    if (email === undefined || !email.trim()) {
      addError("Email is mandatory!");
    }

    if (token === undefined || !token.trim()) {
      addError("The token is mandatory!");
    }

    if (newPw === undefined || !newPw.trim()) {
      addError("Please enter a Lastname!");
    }

    if (!pwStrengthData.state.includes("strong")) {
      addError("Please enter a strong password!");
    }

    if (hasError) {
      msg += "</ul>";
      setErrMsg({ __html: msg });
    }

    console.log(msg);

    return hasError;
  };

  const resetPw = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
      const payload = {
        email: email,
        token: token,
        password: newPw,
      };
      UsersService.forgotPw2(payload).then((response) => {
        if (response.data.error) {
          setErrMsg({ __html: response.data.message });
        } else {
          window.location.href = "/login?msg=res";
        }
      });
    } else {
      setBtnDisabled(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading fontSize={"2xl"}>Reset Password Step 2</Heading>
      {errMsg && (
        <div
          className="chakra-alert"
          data-status="error"
          role="alert"
          style={{ backgroundColor: "var(--chakra-colors-red-600)", padding: "10px", color: "var(--chakra-colors-white)" }}
        >
          <div dangerouslySetInnerHTML={errMsg}></div>
        </div>
      )}

      <form onSubmit={resetPw}>
        <Stack spacing={3}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="text" value={email} isDisabled={true} />
          </FormControl>
          <FormControl id="token">
            <FormLabel>Token</FormLabel>
            <Input type="text" value={token} isDisabled={true} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputLeftElement
                color="blue.300"
                fontSize="1.2em"
                children={<MdRefresh />}
                cursor={"pointer"}
                title="generate password..."
                onClick={handleGeneratePassword}
              />
              <Input type={passwordVisible ? "text" : "password"} name="password" value={newPw} onChange={handleChange} />
              <InputRightElement
                color={passwordVisible ? "blue.500" : "grey.500"}
                fontSize="1.2em"
                children={<MdRemoveRedEye />}
                cursor={"pointer"}
                title="view/hide password..."
                onClick={handlePasswordVisibility}
              />
            </InputGroup>
            <PasswordChecker password={newPw} strengthData={getPasswordData} />
          </FormControl>
          <Button
            type="button"
            colorScheme="gray"
            isLoading={isLoading}
            loadingText="resetting your password.."
            mt={10}
            onClick={async (e) => await resetPw(e)}
            disabled={btnDisbled}
          >
            Reset my Password!
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default ForgotPw2;
