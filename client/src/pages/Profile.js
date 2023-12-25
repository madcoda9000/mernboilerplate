import UsersService from "../Services/UsersService.js";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../components/shared/Auth/AuthContext";
import { MdRemoveRedEye, MdRefresh } from "react-icons/md";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Box,
  Flex,
  Spacer,
  Center,
  CircularProgress,
} from "@chakra-ui/react";
import password from "secure-random-password";
import { PasswordChecker } from "react-password-strengthbar-ui";
import RoleChecker from "../components/shared/Auth/RoleChecker.js";
import LogsService from "../Services/LogsService.js";
import MfaChecker from "../components/shared/Auth/MfaChecker.js";

const Profile = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const [errMailMsg, setErrMailMsg] = useState(null);
  const [errMailSuccMsg, setErrMailSuccMsg] = useState();
  const [errPwMsg, setErrPwMsg] = useState(null);
  const [errPwSuccMsg, setErrPwSuccMsg] = useState();
  const { user } = useContext(AuthContext);
  const [btnMailIsloading, setBtnMailIsLoading] = useState(false);
  const [btnPwIsloading, setBtnPwIsLoading] = useState(false);
  const [mailFormData, setMailFormData] = useState({
    _id: "",
    email: "",
  });
  const [pwFormData, setPwFormData] = useState({
    _id: "",
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [pwStrengthData, setPwStrengthData] = useState();
  const getPasswordData = (data) => {
    setPwStrengthData(data);
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (!currUser) {
      UsersService.getUser(user._id).then((response) => {
        if (response.data.error) {
          setErrMailMsg(response.data.message);
        } else {
          let name = "_id";
          setMailFormData((prevData) => ({ ...prevData, [name]: response.data.user._id }));
          setPwFormData((prevData) => ({ ...prevData, [name]: response.data.user._id }));
          setCurrUser(response.data.user);
        }
      });
    }
  }, [currUser, user._id]);

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setMailFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const SubmitEmailChange = () => {
    setBtnMailIsLoading(true);
    if (!mailFormData.email.trim()) {
      setBtnMailIsLoading(false);
      setErrMailMsg("Please enter a valid Email address!");
    } else {
      UsersService.changeEmailAddress(mailFormData).then((response) => {
        if (response.data.error) {
          setBtnMailIsLoading(false);
          setErrMailMsg(response.data.message);
        } else {
          var pl = {
            user: currUser.userName,
            level: "info",
            message: "changed his / her email address from " + currUser.email + " to " + mailFormData.email,
          };
          LogsService.createAuditEntry(pl);
          setBtnMailIsLoading(false);
          setErrMailMsg(null);
          setErrMailSuccMsg(response.data.message);
        }
      });
    }
  };

  const SubmitPwChange = () => {
    setBtnPwIsLoading(true);
    let hasError = false;
    let msg = "<ul style='margin-left:20px;'>";

    const addError = (message) => {
      hasError = true;
      msg += `<li>${message}</li>`;
    };

    if (!pwFormData.oldPassword.trim()) {
      addError("Please enter your current password!");
    }
    if (!pwFormData.newPassword.trim()) {
      addError("Please enter your new password!");
    }
    if (!pwFormData.repeatPassword.trim()) {
      addError("Please repeat your new password!");
    }
    if (pwFormData.repeatPassword.trim() !== pwFormData.newPassword.trim()) {
      addError("Your new password and repeated pasword do not match!");
    }
    if (!pwStrengthData.state.includes("strong")) {
      addError("Please enter a strong password!");
    }

    if (hasError) {
      msg += "</ul>";
      setErrPwMsg({ __html: msg });
      setBtnPwIsLoading(false);
    } else {
      let payload = {
        _id: pwFormData._id,
        oldPassword: pwFormData.oldPassword,
        newPassword: pwFormData.newPassword,
      };
      UsersService.changePassword(payload).then((response) => {
        if (response.data.error) {
          setBtnPwIsLoading(false);
          setErrPwMsg({ __html: response.data.message });
        } else {
          var pl = {
            user: currUser.userName,
            level: "info",
            message: "changed his / her password successfully.",
          };
          LogsService.createAuditEntry(pl);
          setBtnPwIsLoading(false);
          setErrPwMsg(null);
          setErrPwSuccMsg(response.data.message);
        }
      });
    }
  };

  const handleGeneratePassword = () => {
    const generatedPassword = password.randomPassword({ length: 16, characters: [password.lower, password.upper, password.digits, password.symbols] });
    setPwFormData((prevData) => ({ ...prevData, newPassword: generatedPassword }));
    setPwFormData((prevData) => ({ ...prevData, repeatPassword: generatedPassword }));
  };

  return (
    <>
      <MfaChecker />
      <RoleChecker requiredRole="any" />
      <>
        {currUser ? (
          <>
            <Box width={{ base: "100%", lg: "60%" }}>
              <form id="frmMail">
                <Heading fontSize={"2xl"}>Change your Email address..</Heading>
                {errMailMsg && (
                  <Alert status="error" mt={3}>
                    <AlertIcon />
                    {errMailMsg}
                  </Alert>
                )}
                {errMailSuccMsg && (
                  <Alert status="success" mt={3}>
                    <AlertIcon />
                    {errMailSuccMsg}
                  </Alert>
                )}

                <FormControl id="currEmail" style={{ marginTop: "30px" }}>
                  <FormLabel>Current email address</FormLabel>
                  <Input type="text" name="currEmail" value={currUser.email} disabled={true} />
                </FormControl>
                <FormControl id="email">
                  <FormLabel>New email address</FormLabel>
                  <Input type="text" name="email" disabled={false} onChange={handleEmailChange} />
                </FormControl>
                <Flex spacing={6}>
                  <Spacer />
                  <Button
                    width={300}
                    type="button"
                    colorScheme={"gray"}
                    variant={"solid"}
                    isLoading={btnMailIsloading}
                    disabled={btnMailIsloading}
                    loadingText="Saving..."
                    marginTop={"10"}
                    onClick={() => SubmitEmailChange()}
                  >
                    Change my email address
                  </Button>
                </Flex>
              </form>
              <hr style={{ marginTop: "30px", marginBottom: "30px" }}></hr>
              <form id="frmPwd">
                <Heading fontSize={"2xl"}>Change your password..</Heading>
                {errPwMsg && (
                  <Alert status="error" mt={3}>
                    <AlertIcon />
                    <div dangerouslySetInnerHTML={errPwMsg}></div>
                  </Alert>
                )}
                {errPwSuccMsg && (
                  <Alert status="success" mt={3}>
                    <AlertIcon />
                    {errPwSuccMsg}
                  </Alert>
                )}

                <FormControl id="oldPassword" style={{ marginTop: "30px" }}>
                  <FormLabel>Current password</FormLabel>
                  <Input type="password" name="oldPassword" onChange={handlePwChange} />
                </FormControl>
                <FormControl id="newPassword">
                  <FormLabel>New password</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      color="blue.300"
                      fontSize="1.2em"
                      children={<MdRefresh />}
                      cursor={"pointer"}
                      title="generate password..."
                      onClick={handleGeneratePassword}
                    />
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      name="newPassword"
                      value={pwFormData.newPassword}
                      onChange={handlePwChange}
                      disabled={false}
                    />

                    <InputRightElement
                      color={passwordVisible ? "blue.500" : "grey.500"}
                      fontSize="1.2em"
                      children={<MdRemoveRedEye />}
                      cursor={"pointer"}
                      title="view/hide password..."
                      onClick={handlePasswordVisibility}
                    />
                  </InputGroup>
                </FormControl>
                <PasswordChecker password={pwFormData.newPassword} strengthData={getPasswordData} />

                <FormControl id="repeatPassword">
                  <FormLabel>Repeat new password</FormLabel>
                  <Input type={passwordVisible ? "text" : "password"} name="repeatPassword" value={pwFormData.repeatPassword} onChange={handlePwChange} />
                </FormControl>
                <Flex spacing={6}>
                  <Spacer />
                  <Button
                    width={300}
                    type="button"
                    colorScheme={"gray"}
                    variant={"solid"}
                    isLoading={btnPwIsloading}
                    disabled={btnPwIsloading}
                    loadingText="Saving..."
                    marginTop={"10"}
                    onClick={SubmitPwChange}
                  >
                    Change my password
                  </Button>
                </Flex>
              </form>
            </Box>
          </>
        ) : (
          <Center width={"100%"} mt={40}>
            <CircularProgress isIndeterminate color="blue.500" />
          </Center>
        )}
      </>
    </>
  );
};

export default Profile;
