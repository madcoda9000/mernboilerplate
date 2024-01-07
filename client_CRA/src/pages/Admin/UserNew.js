import { useNavigate } from "react-router-dom";
import RoleChecker from "../../components/shared/Auth/RoleChecker";
import React, { useContext, useEffect, useState } from "react";
import password from "secure-random-password";
import { PasswordChecker } from "react-password-strengthbar-ui";
import UsersService from "../../Services/UsersService.js";
import RolesService from "../../Services/RolesService.js";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Checkbox,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spacer,
  Stack,
  VStack,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { MdOutlinePeople, MdOutlineWarning, MdRefresh, MdRemoveRedEye } from "react-icons/md";
import ToastBox from "../../components/shared/UI/ToastBox.js";
import AuthContext from "../../components/shared/Auth/AuthContext";
import { makeAuditEntry } from "../../components/shared/Utils";
import MfaChecker from "../../components/shared/Auth/MfaChecker.js";

const UserNew = () => {
  const [btnPwIsloading, setbtnPwIsloading] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [allRoles, setAllRoles] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [succMsg, setSuccMsg] = useState("If you want to change the users data without changing the password, simply leave the password field empty!");
  const [succMsgType, setSuccMsgType] = useState("info");
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pwStrengthData, setPwStrengthData] = useState();
  const navigate = useNavigate();
  const [hintText, setHintText] = useState(null);
  const [replaceRoles, setReplaceRoles] = useState(true);
  const toast = useToast();
  const toastIdRef = React.useRef();
  const { user } = useContext(AuthContext);

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  useEffect(() => {
    var nu = {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      emailVerified: true,
      accountLocked: false,
      ldapEnabled: false,
      mfaEnabled: false,
      mfaEnforced: false,
      roles: ["users"],
    };
    if (!newUser) {
      setNewUser(nu);
    }
  }, [newUser]);

  useEffect(() => {
    if (!allRoles) {
      RolesService.getRoles(1, 1000, "").then((response) => {
        if (response.error) {
          setErrMsg(response.data.message);
        } else {
          setAllRoles(response.data.paginatedResult);

          var inputs = document.querySelectorAll("[data-grp='roleName']");
          var n = inputs.length;
          if (newUser !== null && replaceRoles === true && n !== null && n > 0) {
            for (var i = 0; i < inputs.length; i++) {
              var attrName = inputs[i].getAttribute("name");
              if (newUser.roles.includes(attrName)) {
                inputs[i].checked = true;
              }
            }
            setReplaceRoles(false);
          }
        }
      });
    }
  }, [allRoles, newUser, replaceRoles]);

  const markCurrRole = () => {};

  const handleGeneratePassword = () => {
    const generatedPassword = password.randomPassword({ length: 16, characters: [password.lower, password.upper, password.digits, password.symbols] });
    setNewUser((prevData) => ({ ...prevData, password: generatedPassword }));
  };

  const handleChange = (e) => {
    const { checked, name } = e.target;

    // For checkboxes, use the checked value; for other inputs, use the input value
    const value = name === "mfaEnforced" || name === "ldapEnabled" ? checked : e.target.value;

    setNewUser((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const getPasswordData = (data) => {
    setPwStrengthData(data);
  };

  const valChkBx = (e) => {
    const selBox = document.getElementById(e);
    const nameAttr = selBox.getAttribute("name");
    const isChecked = selBox.checked;

    if (isChecked) {
      const grpBoxes = document.querySelectorAll("[data-grp='roleName']");

      if (nameAttr === "users" || nameAttr === "admins") {
        grpBoxes.forEach((box) => (box.checked = false));
        selBox.checked = true;
        setHintText("NOTE: If the user is a member of User or Admin role, it cannot be a member of other roles!");
      } else {
        document.querySelector('[name="users"]').checked = false;
        document.querySelector('[name="admins"]').checked = false;
        setHintText(null);
      }
    } else {
      selBox.checked = false;
    }

    const rls = Array.from(document.querySelectorAll("[data-grp='roleName']"))
      .filter((box) => box.checked)
      .map((box) => box.getAttribute("name"));

    setNewUser((prevUser) => ({ ...prevUser, roles: rls }));
  };

  const ValidateForm = () => {
    let hasError = false;
    let errmMsg = "<ul style='margin-left:20px;'>";

    const { userName, firstName, lastName, email, password } = newUser;

    const addError = (message) => {
      hasError = true;
      errmMsg += `<li>${message}</li>`;
    };

    if (!userName.trim()) {
      addError("Please enter a Username!");
    }

    if (!firstName.trim()) {
      addError("Please enter a Firstname!");
    }

    if (!lastName.trim()) {
      addError("Please enter a Lastname!");
    }

    if (!email.trim()) {
      addError("Please enter an email address!");
    } else {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(email)) {
        addError("Please enter a valid email address!");
      }
    }

    if (password.trim() === "") {
      addError("Please enter a password!");
    }

    if (password.trim() !== "" && !pwStrengthData.state.includes("strong")) {
      addError("Please enter a strong password!");
    }

    if (newUser.roles.length === 0) {
      addError("Please select at least one role!");
    }

    if (hasError) {
      errmMsg += "</ul>";
      setErrMsg({ __html: errmMsg });
    }

    return hasError;
  };

  const SaveUser = () => {
    console.log(newUser);
    if (!ValidateForm()) {
      setbtnPwIsloading(true);
      UsersService.createUser(newUser).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          makeAuditEntry(user.userName, "info", "created new user " + newUser.userName);
          var nu = {
            userName: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            pwResetToken: "",
            emailVerifyToken: "",
            emailVerified: true,
            accountLocked: false,
            ldapEnabled: false,
            mfaEnabled: false,
            mfaEnforced: false,
            roles: ["users"],
          };
          setNewUser(nu);
          setErrMsg(null);
          var inputs = document.querySelectorAll("[data-grp='roleName']");
          var n = inputs.length;
          if (newUser !== null && n !== null && n > 0) {
            for (var i = 0; i < inputs.length; i++) {
              var attrName = inputs[i].getAttribute("name");
              if (attrName === "users") {
                inputs[i].checked = true;
              } else {
                inputs[i].checked = false;
              }
            }
          }
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
      setbtnPwIsloading(false);
    }
  };

  return (
    <>
      <MfaChecker />
      <RoleChecker requiredRole="admins" />
      {!newUser && !allRoles ? (
        <Center width={"100%"} mt={40}>
          <CircularProgress isIndeterminate color="blue.500" />
        </Center>
      ) : (
        <>
          <MfaChecker />
          <RoleChecker requiredRole="admins" />
          {isLargerThan500 ? (
            <>
              <HStack>
                <Icon as={MdOutlinePeople} display={"inline"} mr={"10px"} w={10} h={10} />
                <Heading fontSize={"2xl"} display={"inline"}>
                  Create new User...
                </Heading>
              </HStack>

              <Flex>
                <Box w={"60%"} borderRight={"1px"} borderColor={"blue.500"} paddingRight={"30px"} mt={"30px"}>
                  <Alert status={succMsgType} variant={"left-accent"}>
                    <AlertIcon />
                    {succMsg}
                  </Alert>
                  {errMsg && (
                    <div
                      className="chakra-alert"
                      data-status="error"
                      role="alert"
                      style={{ backgroundColor: "var(--chakra-colors-red-600)", padding: "15px", color: "var(--chakra-colors-white)", marginTop: "20px" }}
                    >
                      <HStack>
                        <Icon as={MdOutlineWarning} display={"inline"} mr={"10px"} w={6} h={6} mb={3} />
                        <Heading fontSize={"lg"} style={{ marginBottom: "10px" }}>
                          Please correct the following errors..
                        </Heading>
                      </HStack>
                      <div dangerouslySetInnerHTML={errMsg}></div>
                    </div>
                  )}
                  <VStack alignItems={"left"}>
                    <FormControl id="userName" style={{ marginTop: "20px" }}>
                      <FormLabel>Username</FormLabel>
                      <Input type="text" name="userName" onChange={(e) => handleChange(e)} value={newUser.userName} />
                    </FormControl>
                    <FormControl id="firstName">
                      <FormLabel>Firstname</FormLabel>
                      <Input type="text" name="firstName" onChange={(e) => handleChange(e)} value={newUser.firstName} />
                    </FormControl>
                    <FormControl id="lastName">
                      <FormLabel>Lastname</FormLabel>
                      <Input type="text" name="lastName" onChange={(e) => handleChange(e)} value={newUser.lastName} />
                    </FormControl>
                    <FormControl id="email">
                      <FormLabel>Email address</FormLabel>
                      <Input type="text" name="email" onChange={(e) => handleChange(e)} value={newUser.email} />
                    </FormControl>
                    <FormControl id="password">
                      <FormLabel>New password</FormLabel>
                      <InputGroup>
                        <InputLeftElement
                          color="blue.300"
                          fontSize="1.2em"
                          children={<MdRefresh />}
                          cursor={"pointer"}
                          title="generate password..."
                          onClick={() => handleGeneratePassword()}
                        />
                        <Input type={passwordVisible ? "text" : "password"} name="password" onChange={handleChange} disabled={false} value={newUser.password} />

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
                    <PasswordChecker password={newUser.password} strengthData={getPasswordData} />
                  </VStack>
                  <Stack direction="column" mt={"20px"}>
                    <Checkbox onChange={(e) => handleChange(e)} colorScheme="blue" value={newUser.ldapEnabled} name="ldapEnabled">
                      Enable LDAP login?
                    </Checkbox>
                    <Checkbox onChange={(e) => handleChange(e)} colorScheme="blue" value={newUser.mfaEnforced} name="mfaEnforced">
                      Enforce 2FA Authentication?
                    </Checkbox>
                  </Stack>
                  <HStack mt={"30px"}>
                    <Spacer />
                    <Button mr={"30px"} onClick={() => navigate("/Admin/Users")} colorScheme={"gray"}>
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      variant={"solid"}
                      isLoading={btnPwIsloading}
                      disabled={btnPwIsloading}
                      loadingText="Saving..."
                      onClick={() => SaveUser()}
                    >
                      Save user...
                    </Button>
                  </HStack>
                </Box>
                <Box w={"30%"} paddingLeft={"30px"}>
                  <Heading size={"l"} mt={"20px"} pb={"20px"}>
                    Please select one or more roles
                  </Heading>
                  {hintText && (
                    <Alert status="warning" variant={"left-accent"}>
                      <AlertIcon />
                      {hintText}
                    </Alert>
                  )}
                  {allRoles
                    ? allRoles.docs.map((role, i) => {
                        return (
                          <Stack direction="column" mt={"20px"} key={i}>
                            <label className="container">
                              {role.roleName}
                              <input
                                onChange={(e) => valChkBx(e.target.id)}
                                type="checkbox"
                                name={role.roleName}
                                id={role.roleName}
                                label={role.roleName}
                                data-rname={role.roleName}
                                data-grp="roleName"
                              />
                              <span className="checkmark"></span>
                            </label>
                          </Stack>
                        );
                      })
                    : null}
                  {markCurrRole()}
                </Box>
              </Flex>
            </>
          ) : (
            <>is mobile!</>
          )}
        </>
      )}
    </>
  );
};
export default UserNew;
