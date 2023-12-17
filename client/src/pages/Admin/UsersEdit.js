import { useParams, useNavigate } from "react-router-dom";
import RoleChecker from "../../components/shared/Auth/RoleChecker";
import { useContext, useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { MdOutlinePeople, MdOutlineWarning, MdRefresh, MdRemoveRedEye } from "react-icons/md";
import AuthContext from "../../components/shared/Auth/AuthContext";
import { makeAuditEntry } from "../../components/shared/Utils";

const UsersEdit = () => {
  const props = useParams();
  const [btnPwIsloading, setbtnPwIsloading] = useState(false);
  const [currUser, setCurrUser] = useState(null);
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
  const { user } = useContext(AuthContext);
  const [loggedAlready, setLoggedAlready] = useState(false);

  useEffect(() => {
    if (!currUser) {
      UsersService.getUser(props.id).then((response) => {
        if (response.data.error) {
          setErrMsg(response.data.message);
        } else {
          setCurrUser(response.data.user);
          setCurrUser((prevData) => ({ ...prevData, password: "" }));
        }
      });
    }
  }, [currUser, props.id]);

  useEffect(() => {
    if (!loggedAlready && currUser) {
      makeAuditEntry(user.userName, "info", "viewed user details for user " + currUser.userName);
      setLoggedAlready(true);
    }
  }, [currUser, loggedAlready, user.userName]);

  useEffect(() => {
    if (!allRoles) {
      RolesService.getRoles(1, 1000, "").then((response) => {
        if (response.error) {
          setErrMsg(response.data.message);
        } else {
          setAllRoles(response.data.paginatedResult);
        }
      });
    }
  }, [allRoles]);

  const markCurrRole = () => {
    var inputs = document.querySelectorAll("[data-grp='roleName']");
    var n = inputs.length;
    if (replaceRoles === true && n !== null && n > 0) {
      for (var i = 0; i < inputs.length; i++) {
        var attrName = inputs[i].getAttribute("name");
        if (currUser.roles.includes(attrName)) {
          inputs[i].checked = true;
        }
      }
      setReplaceRoles(false);
    }
  };

  const handleGeneratePassword = () => {
    const generatedPassword = password.randomPassword({ length: 16, characters: [password.lower, password.upper, password.digits, password.symbols] });
    setCurrUser((prevData) => ({ ...prevData, password: generatedPassword }));
  };

  const handleChange = (e) => {
    const { checked, name } = e.target;

    // For checkboxes, use the checked value; for other inputs, use the input value
    const value = name === "mfaEnforced" || name === "ldapEnabled" ? checked : e.target.value;

    setCurrUser((prevData) => ({ ...prevData, [name]: value }));
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

    setCurrUser((prevUser) => ({ ...prevUser, roles: rls }));
  };

  const ValidateForm = () => {
    let hasError = false;
    let errmMsg = "<ul style='margin-left:20px;'>";

    const { userName, firstName, lastName, email, password } = currUser;

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

    if (password.trim() !== "" && !pwStrengthData.state.includes("strong")) {
      addError("Please enter a strong password!");
    }

    if (currUser.roles.length === 0) {
      addError("Please select at least one role!");
    }

    if (hasError) {
      errmMsg += "</ul>";
      setErrMsg({ __html: errmMsg });
    }

    return hasError;
  };

  const SaveUser = () => {
    if (!ValidateForm()) {
      setbtnPwIsloading(true);

      UsersService.updateUser(currUser).then((response) => {
        if (response.data.error) {
          setSuccMsg(response.data.message);
          setSuccMsgType("error");
        } else {
          makeAuditEntry(user.userName, "info", "modified user " + currUser.userName);
          setSuccMsg(response.data.message);
          setSuccMsgType("success");
        }
      });
      setbtnPwIsloading(false);
    }
  };

  return (
    <>
      <RoleChecker requiredRole="admins" />
      {!currUser && !allRoles ? (
        <Center width={"100%"} mt={40}>
          <CircularProgress isIndeterminate color="blue.500" />
        </Center>
      ) : (
        <>
          {isLargerThan500 && currUser && allRoles ? (
            <>
              <HStack>
                <Icon as={MdOutlinePeople} display={"inline"} mr={"10px"} w={10} h={10} />
                <Heading fontSize={"2xl"} display={"inline"}>
                  Edit User...
                </Heading>
              </HStack>

              <Flex>
                <Box w={"60%"} borderRight={"1px"} borderColor={"blue.500"} paddingRight={"30px"} mt={"30px"}>
                  <Alert status={succMsgType} colorScheme={"gray"} variant={"left-accent"}>
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
                      <Input
                        type="text"
                        name="userName"
                        value={currUser.userName}
                        onChange={(e) => handleChange(e)}
                        disabled={currUser.userName === "super.admin"}
                      />
                    </FormControl>
                    <FormControl id="firstName">
                      <FormLabel>Firstname</FormLabel>
                      <Input type="text" name="firstName" value={currUser.firstName} onChange={(e) => handleChange(e)} />
                    </FormControl>
                    <FormControl id="lastName">
                      <FormLabel>Lastname</FormLabel>
                      <Input type="text" name="lastName" value={currUser.lastName} onChange={(e) => handleChange(e)} />
                    </FormControl>
                    <FormControl id="email">
                      <FormLabel>Email address</FormLabel>
                      <Input type="text" name="email" value={currUser.email} onChange={(e) => handleChange(e)} />
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
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          onChange={handleChange}
                          value={currUser.password}
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
                    <PasswordChecker password={currUser.password} strengthData={getPasswordData} />
                  </VStack>
                  <Stack direction="column" mt={"20px"}>
                    <Checkbox
                      disabled={currUser.userName === "super.admin"}
                      onChange={(e) => handleChange(e)}
                      colorScheme="gray"
                      value={currUser.ldapEnabled}
                      name="ldapEnabled"
                    >
                      Enable LDAP login?
                    </Checkbox>
                    <Checkbox
                      onChange={(e) => handleChange(e)}
                      colorScheme="gray"
                      value={currUser.mfaEnforced}
                      name="mfaEnforced"
                      disabled={currUser.mfaEnabled || currUser.userName === "super.admin" ? true : false}
                      title={currUser.mfaEnabled ? "User has enabled 2FA already!" : "2FA is not enabled by user."}
                    >
                      Enforce 2FA Authentication?
                    </Checkbox>
                  </Stack>
                  <HStack mt={"30px"}>
                    <Spacer />
                    <Button mr={"30px"} onClick={() => navigate("/Admin/Users")}>
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      colorScheme={"gray"}
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
                  {currUser.userName === "super.admin" ? (
                    <Heading size={"l"} mt={"20px"} pb={"20px"} style={{ color: "var(--chakra-colors-gray-300)" }}>
                      Role assignment disabled!
                    </Heading>
                  ) : (
                    <Heading size={"l"} mt={"20px"} pb={"20px"}>
                      Please select one or more roles
                    </Heading>
                  )}
                  {hintText && (
                    <Alert status="warning" colorScheme={"gray"} variant={"left-accent"}>
                      <AlertIcon />
                      {hintText}
                    </Alert>
                  )}
                  {allRoles.docs.map((role, i) => {
                    return (
                      <Stack direction="column" mt={"20px"} key={i}>
                        <label className="container">
                          {role.roleName}
                          <input
                            disabled={currUser.userName === "super.admin"}
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
                  })}
                  {markCurrRole()}
                </Box>
              </Flex>
            </>
          ) : (
            <Box>
              <span>mobile!</span>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default UsersEdit;
