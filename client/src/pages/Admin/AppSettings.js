import React, { useContext } from "react";
import RoleChecker from "../../components/shared/Auth/RoleChecker";
import { useEffect, useState } from "react";
import {
  Icon,
  Alert,
  AlertIcon,
  Box,
  CircularProgress,
  Center,
  Heading,
  useMediaQuery,
  HStack,
  Button,
  Flex,
  Spacer,
  CloseButton,
  Checkbox,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineListAlt } from "react-icons/md";
import AuthContext from "../../components/shared/Auth/AuthContext";
import { makeAuditEntry } from "../../components/shared/Utils";
import SettingsService from "../../Services/SettingsService";
import { useNavigate } from "react-router-dom";
import ToastBox from "../../components/shared/UI/ToastBox";
import MfaChecker from "../../components/shared/Auth/MfaChecker";

const AppSettings = () => {
  const [isLoading, SetIsLoading] = useState(true);
  const [errMsg, SetErrMsg] = useState(null);
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const { user } = useContext(AuthContext);
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();
  const [btnPwIsloading, setbtnPwIsloading] = useState(false);
  const toast = useToast();
  const toastIdRef = React.useRef();

  useEffect(() => {
    if (!settings) {
      SettingsService.getApplicationSettings().then((response) => {
        if (response.data.error) {
          SetErrMsg(response.data.message);
          SetIsLoading(false);
        } else {
          setSettings(response.data.settings);
          makeAuditEntry(user.userName, "info", "viewed Application Settings");
          SetIsLoading(false);
        }
      });
    }
  }, [settings, user.userName]);

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const handleChange = (e) => {
    const { checked, name } = e.target;

    // For checkboxes, use the checked value; for other inputs, use the input value
    const value =
      name === "showMfaEnableBanner" || name === "showRegisterLink" || name === "showResetPasswordLink" || name === "showQuoteOfTheDay"
        ? checked
        : e.target.value;

    setSettings((prevData) => ({ ...prevData, [name]: value === true ? "true" : "false" }));
  };

  const SaveSettings = () => {
    setbtnPwIsloading(true);
    SettingsService.updateAppSettings(settings).then((response) => {
      if (response.data.error) {
        toastIdRef.current = toast({
          position: "bottom-right",
          render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
        });
        setbtnPwIsloading(false);
      } else {
        localStorage.setItem("AppSettings", JSON.stringify(settings));
        toastIdRef.current = toast({
          position: "bottom-right",
          render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
        });
        makeAuditEntry(user.userName, "info", "modified Application Settings");
        setbtnPwIsloading(false);
      }
    });
  };

  return (
    <>
      {isLoading && !settings ? (
        <>
          <MfaChecker />
          <RoleChecker requiredRole="admins" />
          <Center width={"100%"} mt={40}>
            <CircularProgress isIndeterminate color="blue.500" />
          </Center>
        </>
      ) : (
        <>
          <RoleChecker requiredRole="admins" />
          <Box width={isLargerThan500 ? "50%" : "100%"}>
            <HStack>
              <Flex width={"100%"}>
                <HStack>
                  <Icon as={MdOutlineListAlt} display={"inline"} mr={"10px"} w={10} h={10} />
                  <Heading fontSize={"2xl"} display={"inline"}>
                    Application Settings...
                  </Heading>
                </HStack>
              </Flex>
            </HStack>
            {errMsg && (
              <Alert status="error" variant={"solid"} mt={7}>
                <AlertIcon />
                <Box>{errMsg}</Box>
                <CloseButton alignSelf="flex-end" position="absolute" right={2} top={2} onClick={() => SetErrMsg(null)} />
              </Alert>
            )}
            <Stack direction="column" mt={"50px"} ml={"7px"}>
              <Checkbox
                onChange={(e) => handleChange(e)}
                colorScheme="gray"
                isChecked={settings.showMfaEnableBanner === "true" ? true : false}
                name="showMfaEnableBanner"
              >
                Show 2FA enable banner? (if 2fa is not enabled)?
              </Checkbox>
              <Checkbox
                onChange={(e) => handleChange(e)}
                colorScheme="gray"
                isChecked={settings.showRegisterLink === "true" ? true : false}
                name="showRegisterLink"
              >
                Show register link on login page?
              </Checkbox>
              <Checkbox
                onChange={(e) => handleChange(e)}
                colorScheme="gray"
                isChecked={settings.showResetPasswordLink === "true" ? true : false}
                name="showResetPasswordLink"
              >
                Show forgot password link on login page?
              </Checkbox>
              <Checkbox
                onChange={(e) => handleChange(e)}
                colorScheme="gray"
                isChecked={settings.showQuoteOfTheDay === "true" ? true : false}
                name="showQuoteOfTheDay"
              >
                Show Quote of the day on login page?
              </Checkbox>
            </Stack>
            <HStack mt={"60px"}>
              <Spacer />
              <Button mr={"30px"} onClick={() => navigate("/Home")}>
                Cancel
              </Button>

              <Button
                type="button"
                colorScheme={"gray"}
                variant={"solid"}
                isLoading={btnPwIsloading}
                disabled={btnPwIsloading}
                loadingText="Saving..."
                onClick={() => SaveSettings()}
              >
                Save settings...
              </Button>
            </HStack>
          </Box>
        </>
      )}
    </>
  );
};

export default AppSettings;
