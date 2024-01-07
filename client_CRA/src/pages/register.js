import React, { useState } from "react";
import { MdRemoveRedEye, MdRefresh } from "react-icons/md";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Heading,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  HStack,
  Spacer,
  Center,
} from "@chakra-ui/react";
import password from "secure-random-password";
import { PasswordChecker } from "react-password-strengthbar-ui";
import axios from "axios";
import LogsService from "../Services/LogsService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const apiurl = window.BASE_URL;
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [pwStrengthData, setPwStrengthData] = useState();
  const getPasswordData = (data) => {
    setPwStrengthData(data);
  };
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGeneratePassword = () => {
    const generatedPassword = password.randomPassword({ length: 16, characters: [password.lower, password.upper, password.digits, password.symbols] });
    setFormData((prevData) => ({ ...prevData, password: generatedPassword }));
    setFormData((prevData) => ({ ...prevData, confirmPassword: generatedPassword }));
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    let hasError = false;
    let errMsg = "<ul style='margin-left:20px;'>";

    const addError = (message) => {
      hasError = true;
      errMsg += `<li>${message}</li>`;
    };

    const { username, firstName, lastName, email } = formData;

    if (!username.trim()) {
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
    if (!pwStrengthData.state.includes("strong")) {
      addError("Please enter a strong password!");
    }

    if (hasError) {
      errMsg += "</ul>";
      setErrMsg({ __html: errMsg });
    }

    return hasError;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!validateForm()) {
      let payload = {
        userName: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      const apiResponse = await axios.post(apiurl + "/v1/auth/signup", payload);
      if (apiResponse.data.error === false) {
        window.location.href = "/login?msg=reg";
      } else {
        setErrMsg(apiResponse.data.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <Center>
        <Heading fontSize={"2xl"}>Register a new account</Heading>
      </Center>

      {errMsg && (
        <div
          className="chakra-alert"
          data-status="error"
          role="alert"
          style={{ backgroundColor: "var(--chakra-colors-red-500)", padding: "10px", color: "var(--chakra-colors-white)", marginTop: "30px" }}
        >
          <Heading fontSize={"lg"} style={{ marginBottom: "10px" }}>
            Please correct the following errors..
          </Heading>
          <div dangerouslySetInnerHTML={errMsg}></div>
        </div>
      )}
      <form>
        <Stack spacing={3} mt={"30px"}>
          <FormControl>
            <Input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
          </FormControl>

          <FormControl>
            <Input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Firstname" />
          </FormControl>

          <FormControl>
            <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Lastname" />
          </FormControl>

          <FormControl>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" />
          </FormControl>

          <FormControl>
            <InputGroup>
              <InputLeftElement
                color="blue.300"
                fontSize="1.2em"
                children={<MdRefresh />}
                cursor={"pointer"}
                title="generate password..."
                onClick={handleGeneratePassword}
              />
              <Input type={passwordVisible ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              <InputRightElement
                color={passwordVisible ? "blue.500" : "grey.500"}
                fontSize="1.2em"
                children={<MdRemoveRedEye />}
                cursor={"pointer"}
                title="view/hide password..."
                onClick={handlePasswordVisibility}
              />
            </InputGroup>
            <PasswordChecker password={formData.password} strengthData={getPasswordData} />
          </FormControl>
          <HStack mt={"30px"}>
            <Spacer />
            <Button type="Button" onClick={() => navigate("/login")} mr={"3"} colorScheme="gray">
              Cancel
            </Button>
            <Button
              type="button"
              isLoading={isLoading}
              loadingText="creating your account.."
              onClick={async () => await handleSubmit()}
              disabled={isLoading}
              w={"180px"}
            >
              Registrieren
            </Button>
          </HStack>
        </Stack>
      </form>
    </>
  );
};

export default Register;
