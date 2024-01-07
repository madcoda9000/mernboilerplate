import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  CircularProgress,
  HStack,
  Heading,
  Icon,
  ListItem,
  OrderedList,
  PinInput,
  PinInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import AuthContext from "../components/shared/Auth/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "../Services/UsersService";
import RoleChecker from "../components/shared/Auth/RoleChecker";
import QRCode from "react-qr-code";
import { MdOutlineSecurity } from "react-icons/md";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { makeAuditEntry } from "../components/shared/Utils";

const MfaSetup = () => {
  const { user } = useContext(AuthContext);
  const [qrcodeUrl, setqrcodeUrl] = useState(null);
  const [totpSecret, settotpSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [otpToken, setOtpToken] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const [succMsg, setSuccMsg] = useState(null);
  const [activatedSuccessfully, setActivatedSuccessfully] = useState(false);

  useEffect(() => {
    setPageIsLoading(true);
    if (user) {
      console.log("mfaEnabled: " + user.mfaEnabled + " | mfaEnforced:" + user.mfaEnforced);
      if (user.mfaEnabled === true) {
        setqrcodeUrl("kakai");
        setPageIsLoading(false);
      } else if (user.mfaEnabled !== true || user.mfaEnforced === true) {
        let payload = {
          _id: user._id,
        };
        UsersService.startMfaSetup(payload).then((response) => {
          if (response.data.error) {
            setPageIsLoading(false);
            setErrMsg(response.data.message);
          } else {
            makeAuditEntry(user.userName, "info", user.userName + " started 2fa setup..");
            settotpSecret(response.data.base32);
            setqrcodeUrl(response.data.otpUrl);
            setPageIsLoading(false);
          }
        });
      }
    }
  }, [user]);

  const handleChange = (e) => {
    //console.log(e);
    setOtpToken(e);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      _id: user._id,
      token: otpToken,
    };
    UsersService.finishMfaSetup(payload).then((response) => {
      if (response.data.error) {
        setIsLoading(false);
        setErrMsg(response.data.message);
      } else {
        makeAuditEntry(user.userName, "info", user.userName + " finished 2fa setup successfully!");
        setIsLoading(false);
        setErrMsg(null);
        setActivatedSuccessfully(true);
        setSuccMsg(response.data.message);
        var mcount = 1;
        var inv = setInterval(() => {
          if (mcount > 0) {
            mcount = mcount - 1;
          } else {
            goHome(inv);
          }
        }, 1000);
      }
    });
    setIsLoading(false);
  };

  function goHome(intervalId) {
    clearInterval(intervalId);
    navigate("/login");
  }

  const cancelMfaLogin = () => {
    if (sessionStorage.getItem("accessToken")) {
      sessionStorage.removeItem("accessToken");
    }
    if (sessionStorage.getItem("refreshToken")) {
      sessionStorage.removeItem("acc");
    }
    navigate("/login");
  };

  const disableMfa = () => {
    setIsLoading(true);
    const payload = {
      _id: user._id,
      execUserId: user._id,
    };
    UsersService.disableMfa(payload).then((response) => {
      if (response.data.error) {
        setErrMsg(response.data.message);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrMsg(null);
        setSuccMsg(response.data.message);
        setActivatedSuccessfully(true);
        var mcount = 1;
        var inv = setInterval(() => {
          if (mcount > 0) {
            mcount = mcount - 1;
          } else {
            goHome(inv);
          }
        }, 1000);
      }
    });
  };

  if (pageIsLoading || qrcodeUrl === null) {
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
        {user.mfaEnabled === true ? (
          <>
            <HStack>
              <Icon color={"yellow.500"} as={MdOutlineSecurity} display={"inline"} mr={"10px"} w={10} h={10} />
              <Heading fontSize={"2xl"} display={"inline"}>
                2FA Authentication
              </Heading>
            </HStack>
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
            <Alert status="success" shadow={"base"}>
              <Box>
                <AlertTitle>2fa Authentication configured already!</AlertTitle>
                <AlertDescription>
                  You've successfully configured 2FA Authentication.
                  <br /> <br />
                  <b>It is strongly recommended to leave 2FA Authentication enabled as it dramatically increases your account security.</b>
                  <br />
                  <br />
                  If you still want to disable 2FA Authentication for your account, you can do so by clicking the button below. <b>Note:</b> by deactivating 2FA
                  authentication, you'll getting logged out and you've to login again!
                  <br />
                </AlertDescription>
              </Box>
            </Alert>
            <HStack spacing={6} mt={"30px"}>
              <Button type="Button" onClick={() => navigate("/Home")} mr={"3"} isDisabled={isLoading} colorScheme={"gray"}>
                Back
              </Button>
              <Button
                width={"100%"}
                type="button"
                colorScheme={"red"}
                variant={"solid"}
                isDisabled={activatedSuccessfully}
                isLoading={isLoading}
                loadingText="loading ..."
                onClick={() => disableMfa()}
              >
                Disable 2FA authentication now..
              </Button>
            </HStack>
          </>
        ) : (
          <>
            {user.mfaEnforced === true ? (
              <>
                <HStack>
                  <Icon color={"yellow.500"} as={MdOutlineSecurity} display={"inline"} mr={"10px"} w={10} h={10} />
                  <Heading fontSize={"2xl"} display={"inline"}>
                    2FA Authentication setup
                  </Heading>
                </HStack>
                {errMsg && (
                  <Alert status="error" colorScheme={"gray"} variant={"left-accent"}>
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
                <Alert status="info">
                  <Box>
                    <AlertDescription>
                      Your administrator has enforced to enable 2FA Authentication for your account.
                      <br /> <br />
                      Configuring 2FA AUthentication is getting done in three steps:
                      <br />
                      <br />
                      <OrderedList>
                        <ListItem>
                          Donwload an OTP App like Google Authenticator&nbsp;
                          <a href="https://play.google.com/store/search?q=google%20authenticator&c=apps&hl=de&gl=US" target="_blank" rel="noreferrer">
                            <Icon color={"green.500"} as={FaGooglePlay} display={"inline"} w={4} h={4} mb={"-2px"} />
                          </a>
                          &nbsp;
                          <a href="https://apps.apple.com/de/app/google-authenticator/id388497605" target="_blank" rel="noreferrer">
                            <Icon as={FaApple} display={"inline"} w={4} h={4} mb={"-2px"} />{" "}
                          </a>
                          or Microsoft Authenticator{" "}
                          <a href="https://play.google.com/store/search?q=microsoft%20authenticator&c=apps&hl=de&gl=US" target="_blank" rel="noreferrer">
                            <Icon color={"green.500"} as={FaGooglePlay} display={"inline"} w={4} h={4} mb={"-2px"} />
                          </a>
                          &nbsp;
                          <a href="https://apps.apple.com/de/app/microsoft-authenticator/id983156458" target="_blank" rel="noreferrer">
                            <Icon as={FaApple} display={"inline"} w={4} h={4} mb={"-2px"} />{" "}
                          </a>
                        </ListItem>
                        <ListItem>
                          Scan the barcode, shown below, with your OTP Authenticator app or enter the the secret manually in your Authenticator app
                        </ListItem>
                        <ListItem>
                          Insert the OTP Code shown by your Authenticator App into the number fields below and click the "Verfify my code" button. NOTE: After
                          enableing 2FA you'll be logged out and have to login again!
                        </ListItem>
                      </OrderedList>
                    </AlertDescription>
                  </Box>
                </Alert>
                <form onSubmit={verifyOtp}>
                  <HStack>
                    <div
                      style={{
                        height: "auto",
                        maxWidth: 150,
                        marginLeft: "15px",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <QRCode value={qrcodeUrl} size={128} />
                    </div>
                    <VStack
                      style={{
                        height: "128px",
                        minHeight: "128px !important",
                        paddingLeft: "20px",
                      }}
                      verticalAlign={"top"}
                      align={"left"}
                    >
                      <Text align={"left"}>
                        <b>Your OTP Secret</b>
                      </Text>
                      <Text align={"left"}>{totpSecret ? totpSecret : "secret here.."}</Text>
                    </VStack>
                  </HStack>
                  <HStack mt={"20px"} mb={"20px"}>
                    <PinInput otp colorScheme="gray" autoFocus={true} onChange={(e) => handleChange(e)}>
                      <PinInputField mr={"30px"} ml={"10px"} />
                      <PinInputField mr={"30px"} />
                      <PinInputField mr={"30px"} />
                      <PinInputField mr={"30px"} />
                      <PinInputField mr={"30px"} />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                  <HStack mt={"50px"}>
                    <Button
                      minWidth={"110px"}
                      type="Button"
                      onClick={() => cancelMfaLogin()}
                      mr={"3"}
                      display={activatedSuccessfully === false ? "block" : "none"}
                      isDisabled={isLoading}
                      colorScheme={"gray"}
                    >
                      Cancel
                    </Button>
                    <Button
                      width={"100%"}
                      type="submit"
                      variant={"solid"}
                      isLoading={isLoading}
                      isDisabled={isLoading}
                      loadingText="verifing..."
                      display={activatedSuccessfully === false ? "block" : "none"}
                    >
                      Verify my code now..
                    </Button>
                    {activatedSuccessfully === true && (
                      <Button type="Button" onClick={() => navigate("/Home")} width={"100%"} colorScheme={"green"} isLoading={true} loadingText={"loading ..."}>
                        loading ...
                      </Button>
                    )}
                  </HStack>
                </form>
              </>
            ) : (
              <>
                <HStack>
                  <Icon color={"yellow.500"} as={MdOutlineSecurity} display={"inline"} mr={"10px"} w={10} h={10} />
                  <Heading fontSize={"2xl"} display={"inline"}>
                    2FA Authentication setup
                  </Heading>
                </HStack>
                {errMsg && (
                  <Alert status="error" colorScheme={"gray"} variant={"left-accent"}>
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

                <Box>
                  Great, that you're willing to enable 2FA Authentication for your account.
                  <br /> <br />
                  Configuring 2FA AUthentication is getting done in three steps:
                  <br />
                  <br />
                  <OrderedList>
                    <ListItem>
                      Donwload an OTP App like Google Authenticator&nbsp;
                      <a href="https://play.google.com/store/search?q=google%20authenticator&c=apps&hl=de&gl=US" target="_blank" rel="noreferrer">
                        <Icon color={"green.500"} as={FaGooglePlay} display={"inline"} w={4} h={4} mb={"-2px"} />
                      </a>
                      &nbsp;
                      <a href="https://apps.apple.com/de/app/google-authenticator/id388497605" target="_blank" rel="noreferrer">
                        <Icon as={FaApple} display={"inline"} w={4} h={4} mb={"-2px"} />{" "}
                      </a>
                      or Microsoft Authenticator{" "}
                      <a href="https://play.google.com/store/search?q=microsoft%20authenticator&c=apps&hl=de&gl=US" target="_blank" rel="noreferrer">
                        <Icon color={"green.500"} as={FaGooglePlay} display={"inline"} w={4} h={4} mb={"-2px"} />
                      </a>
                      &nbsp;
                      <a href="https://apps.apple.com/de/app/microsoft-authenticator/id983156458" target="_blank" rel="noreferrer">
                        <Icon as={FaApple} display={"inline"} w={4} h={4} mb={"-2px"} />{" "}
                      </a>
                    </ListItem>
                    <ListItem>
                      Scan the barcode, shown below, with your OTP Authenticator app or enter the the secret manually in your Authenticator app
                    </ListItem>
                    <ListItem>
                      Insert the OTP Code shown by your Authenticator App into the number fields below and click the "Verfify my code" button. NOTE: After
                      enableing 2FA you'll be logged out and have to login again!
                    </ListItem>
                  </OrderedList>
                </Box>
                <form onSubmit={verifyOtp}>
                  <HStack>
                    <div
                      style={{
                        height: "auto",
                        maxWidth: 150,
                        marginLeft: "15px",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <QRCode value={qrcodeUrl} size={128} />
                    </div>
                    <VStack
                      style={{
                        height: "128px",
                        minHeight: "128px !important",
                        paddingLeft: "20px",
                      }}
                      verticalAlign={"top"}
                      align={"left"}
                    >
                      <Text align={"left"}>
                        <b>Your OTP Secret</b>
                      </Text>
                      <Text align={"left"}>{totpSecret ? totpSecret : "secret here.."}</Text>
                    </VStack>
                  </HStack>
                  <HStack mt={"20px"} mb={"20px"}>
                    <PinInput otp colorScheme="gray" autoFocus={true} onChange={(e) => handleChange(e)}>
                      <PinInputField mr={"30px"} ml={"10px"} />
                      <PinInputField mr={"30px"} />
                      <PinInputField mr={"30px"} />
                      <PinInputField mr={"30px"} />
                      <PinInputField mr={"30px"} />
                      <PinInputField />
                    </PinInput>
                  </HStack>

                  <HStack mt={"50px"}>
                    <Button
                      minWidth={"110px"}
                      type="Button"
                      onClick={() => navigate("/Home")}
                      mr={"3"}
                      display={activatedSuccessfully === false ? "block" : "none"}
                      isDisabled={isLoading}
                      colorScheme={"gray"}
                    >
                      Cancel
                    </Button>
                    <Button
                      width={"100%"}
                      type="submit"
                      variant={"solid"}
                      isLoading={isLoading}
                      isDisabled={isLoading}
                      loadingText="verifing..."
                      display={activatedSuccessfully === false ? "block" : "none"}
                    >
                      Verify my code now..
                    </Button>
                    {activatedSuccessfully === true && (
                      <Button type="Button" onClick={() => navigate("/Home")} width={"100%"} colorScheme={"green"} isLoading={true} loadingText={"loading ..."}>
                        loading ...
                      </Button>
                    )}
                  </HStack>
                </form>
              </>
            )}
          </>
        )}
      </>
    );
  }
};
export default MfaSetup;
