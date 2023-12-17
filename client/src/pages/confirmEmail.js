import { useState, useEffect } from "react";
import { FormControl, FormLabel, Input, Button, Stack, Heading, InputGroup, InputRightElement, InputLeftElement } from "@chakra-ui/react";
import AuthLayout from "../components/Layouts/AuthLayout";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ConfirmEmail = () => {
  const apiurl = window.BASE_URL;
  const [formData, setFormData] = useState({
    token: "",
    email: "",
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let hasError = false;
    let errMsg = "<ul style='margin-left:20px;'>";

    const addError = (message) => {
      hasError = true;
      errMsg += `<li>${message}</li>`;
    };

    if (searchParams.get("_id") === null || !searchParams.get("_id").trim()) {
      addError("User id is missing!");
    } else {
      setFormData((prevData) => ({ ...prevData, _id: searchParams.get("_id").trim() }));
    }
    if (searchParams.get("token") === null || !searchParams.get("token").trim()) {
      addError("Token is missing!");
    } else {
      setFormData((prevData) => ({ ...prevData, token: searchParams.get("token").trim() }));
    }
    if (searchParams.get("email") === null || !searchParams.get("email").trim()) {
      addError("User email address is missing!");
    } else {
      setFormData((prevData) => ({ ...prevData, email: searchParams.get("email").trim() }));
    }

    if (hasError) {
      errMsg += "</ul>";
      setErrMsg({ __html: errMsg });
    }
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    let payload = {
      _id: formData._id,
      token: formData.token,
      email: formData.email,
    };
    const apiResponse = await axios.post(apiurl + "/v1/auth/confirmEmail", payload);
    if (apiResponse.data.error === false) {
      window.location.href = "/login?msg=conf";
    } else {
      setErrMsg(apiResponse.data.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <>
        <Heading fontSize={"2xl"}>Confirm your email address</Heading>
        {errMsg && (
          <div
            className="chakra-alert"
            data-status="error"
            role="alert"
            style={{ backgroundColor: "var(--chakra-colors-red-600)", padding: "10px", color: "var(--chakra-colors-white)" }}
          >
            <Heading fontSize={"lg"} style={{ marginBottom: "10px" }}>
              The following errors occured!
            </Heading>
            <div dangerouslySetInnerHTML={errMsg}></div>
          </div>
        )}
        <form>
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>UserId</FormLabel>
              <Input type="text" name="_id" value={formData._id} disabled={true} />
            </FormControl>
            <FormControl>
              <FormLabel>Token</FormLabel>
              <Input type="text" name="token" value={formData.token} disabled={true} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="text" name="email" value={formData.email} disabled={true} />
            </FormControl>

            <Button
              type="button"
              colorScheme="gray"
              isLoading={isLoading}
              loadingText="validating.."
              mt={10}
              onClick={async () => await handleSubmit()}
              disabled={isLoading}
            >
              Verify my email address..
            </Button>
          </Stack>
        </form>
      </>
    </>
  );
};
export default ConfirmEmail;
