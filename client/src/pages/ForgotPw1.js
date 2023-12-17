import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import UsersService from "../Services/UsersService";
import { useNavigate } from "react-router-dom";

const ForgotPw1 = () => {
  const [isLoading, setIsLoading] = useState();
  const uMail = useRef("");
  const [errMsg, setErrMsg] = useState("");
  const [succMsg, setSuccMsg] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    var hasErrors = false;
    let msg = "";
    if (!msg === "") {
      msg = "";
    }

    if (uMail.current.value.trim() === "") {
      hasErrors = true;
      if (hasErrors) {
        msg = msg + "Email address is mandatory! ";
      }
    }

    if (uMail.current.value.trim() !== "") {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!emailRegex.test(uMail.current.value)) {
        hasErrors = true;
        if (hasErrors) {
          msg = msg + "Please enter a valid email address!";
        }
      }
    }
    setErrMsg(msg);
    return hasErrors;
  };

  const submitForm = () => {
    setIsLoading(true);
    if (!validate()) {
      let payload = {
        email: uMail.current.value,
      };
      UsersService.forgotPw1(payload).then((response) => {
        if (response.data.error) {
          setIsLoading(false);
          setErrMsg(response.data.message);
        } else {
          setIsLoading(false);
          setSuccMsg(response.data.message);
        }
      });
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading fontSize={"2xl"}>Forgot your password?</Heading>
      {errMsg && (
        <Alert status="error" variant={"solid"}>
          <AlertIcon />
          {errMsg}
        </Alert>
      )}
      {succMsg && (
        <Alert status="success" variant={"solid"}>
          <AlertIcon />
          {succMsg}
        </Alert>
      )}
      <Alert status="warning">
        <Box>
          <AlertTitle>Important note!</AlertTitle>
          <AlertDescription>
            Resetting your password requires two steps.
            <br /> <br />
            <b>Step 1</b>
            <br />
            Enter your email address and click on "reset my password".
            <br />
            After doing so, you'r account will become deactivated until you complete Step 2.
            <br />
            <br />
            <b>Step 2</b>
            <br />
            You'll receive an email with an link to an page where you can provide an new password for your account.
          </AlertDescription>
        </Box>
      </Alert>
      <form>
        <FormControl id="email">
          <FormLabel>Email address.</FormLabel>
          <Input type="text" ref={uMail} />
        </FormControl>
        <HStack spacing={6} mt={"30px"}>
          <Spacer />
          <Button type="Button" onClick={() => navigate("/login")} mr={"3"}>
            Cancel
          </Button>
          <Button type="Button" colorScheme={"gray"} variant={"solid"} isLoading={isLoading} loadingText="Submitting..." onClick={() => submitForm()}>
            Reset my password!
          </Button>
        </HStack>
      </form>
    </>
  );
};

export default ForgotPw1;
