import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Center, CircularProgress, HStack, Heading, PinInput, PinInputField, Spacer, Text, VStack, useToast } from "@chakra-ui/react";
import AuthContext from "../components/shared/Auth/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "../Services/UsersService";
import RoleChecker from "../components/shared/Auth/RoleChecker";
import QRCode from "react-qr-code";

const MfaSetup = () => {
    const { user } = useContext(AuthContext);
    const [qrcodeUrl, setqrcodeUrl] = useState(null);
    const [totpSecret, settotpSecret] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [pageIsLoading, setPageIsLoading] = useState(true);
    const [otpToken, setOtpToken] = useState('');
    const [errMsg, setErrMsg] = useState(null);
    const [succMsg, setSuccMsg] = useState(null);
    const toast = useToast();
    const toastIdRef = useRef();

    useEffect(() => {
        setPageIsLoading(true);
        if (user) {
            if (user.mfaEnabled !== true || user.mfaEnforced === true) {
                let payload = {
                    _id: user._id
                }
                UsersService.startMfaSetup(payload).then((response) => {
                    if (response.data.error) {
                        setPageIsLoading(false);
                        setErrMsg(response.data.message);
                    } else {
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

    function closeToast() {
        if (toastIdRef.current) {
            toast.close(toastIdRef.current)
        }
    }


    const verifyOtp = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = {
            _id: user._id,
            token: otpToken
        }
        UsersService.finishMfaSetup(payload).then((response) => {
            if (response.data.error) {
                setIsLoading(false);
                setErrMsg(response.data.message);
            } else {
                setSuccMsg(response.data.message);
            }
        });
        setIsLoading(false);
    }

    const disableMfa = () => {

    }

    if (pageIsLoading || qrcodeUrl === null) {
        return (
            <>
                <RoleChecker requiredRole="any" />
                <Center width={'100%'} mt={40}>
                    <CircularProgress isIndeterminate color='blue.500' />
                </Center>
            </>
        )
    } else {
        return (
            <>
                {user.mfaEnabled === true ?
                    (
                        <>
                            <Heading fontSize={'2xl'}>2FA Authentication</Heading>
                            {errMsg &&
                                <Alert status="error">
                                    <AlertIcon />
                                    {errMsg}
                                </Alert>
                            }
                            {succMsg &&
                                <Alert status="success">
                                    <AlertIcon />
                                    {succMsg}
                                </Alert>
                            }
                            <Alert status='success'>
                                <Box>
                                    <AlertTitle>2fa Authentication configured already!</AlertTitle>
                                    <AlertDescription>
                                        You've successfully configured 2FA Authentication.<br /> <br />
                                        <b>It is strongly recommended to leave 2FA Authentication enabled as it dramatically increases your account security.</b><br /><br />
                                        If you still want to disable 2FA Authentication for four account, you can do so by clicking the button below.<br />
                                    </AlertDescription>
                                </Box>
                            </Alert>
                            <HStack spacing={6} mt={'30px'}>

                                <Button type="Button" onClick={() => navigate("/login")} mr={'3'} >Cancel</Button>
                                <Button
                                    width={'100%'}
                                    type="button"
                                    colorScheme={'blue'}
                                    variant={'solid'}
                                    isLoading={isLoading}
                                    loadingText='verifing...'
                                    onClick={() => disableMfa()}
                                >
                                    Verify my code now..
                                </Button>
                            </HStack>
                        </>
                    )
                    :
                    (
                        <>
                            {user.mfaEnforced === true ?
                                (
                                    <>
                                        <Heading fontSize={'2xl'}>2FA Authentication</Heading>
                                        {errMsg &&
                                            <Alert status="error">
                                                <AlertIcon />
                                                {errMsg}
                                            </Alert>
                                        }
                                        {succMsg &&
                                            <Alert status="success">
                                                <AlertIcon />
                                                {succMsg}
                                            </Alert>
                                        }
                                        <Alert status='warning' variant={'solid'}>
                                            <Box>
                                                <AlertTitle>2fa Authentication enforced!</AlertTitle>
                                                <AlertDescription>
                                                    Your administrator has enforced to enable 2FA Authentication for your account.<br /> <br />
                                                    Configuring 2FA AUthentication is getting done in three steps:<br /><br />
                                                    <b>Step One</b><br />
                                                    Donwload an OTP App like Google Authenticator or Microsoft Authenticator<br /><br />
                                                    <b>Step Two</b><br />
                                                    Scan the barcode, shown below, with your OTP Authenticator app or enter the the secret manually in your Authenticator app<br /><br />
                                                    <b>Step Three</b><br />
                                                    Insert the OTP Code shown by your Authenticator App into the number fields below and click the "Verfify my code" button<br /><br />
                                                </AlertDescription>
                                            </Box>
                                        </Alert>
                                        <form onSubmit={verifyOtp}>
                                            <HStack>
                                                <img
                                                    width={'128'}
                                                    height={'128'}
                                                    src={qrcodeUrl ? qrcodeUrl : 'images/avatar.jpg'}
                                                    alt="qrcode url"
                                                />
                                                <VStack style={{ height: '128px', minHeight: '128px !important', paddingLeft: '20px' }} verticalAlign={'top'} align={'left'}>
                                                    <Text align={'left'}><b>Your OTP Secret</b></Text>
                                                    <Text align={'left'}>{totpSecret ? totpSecret : 'secret here..'}</Text>
                                                </VStack>
                                            </HStack>
                                            <HStack mt={'20px'} mb={'20px'}>
                                                <PinInput otp>
                                                    <PinInputField mr={'30px'} ml={'10px'} />
                                                    <PinInputField mr={'30px'} />
                                                    <PinInputField mr={'30px'} />
                                                    <PinInputField mr={'30px'} />
                                                    <PinInputField mr={'30px'} />
                                                    <PinInputField />
                                                </PinInput>
                                            </HStack>

                                            <HStack spacing={6} mt={'30px'}>

                                                <Button type="Button" onClick={() => navigate("/Home")} mr={'3'} >Cancel</Button>
                                                <Button
                                                    width={'100%'}
                                                    type="submit"
                                                    colorScheme={'blue'}
                                                    variant={'solid'}
                                                    isLoading={isLoading}
                                                    loadingText='verifing...'
                                                >
                                                    Verify my code now..
                                                </Button>
                                            </HStack>
                                        </form>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <Heading fontSize={'2xl'}>2FA Authentication setup...</Heading>
                                        {errMsg &&
                                            <Alert status="error">
                                                <AlertIcon />
                                                {errMsg}
                                            </Alert>
                                        }
                                        {succMsg &&
                                            <Alert status="success">
                                                <AlertIcon />
                                                {succMsg}
                                            </Alert>
                                        }

                                        <Box>

                                            Great, that you're willing to enable 2FA Authentication for your account.<br /> <br />
                                            Configuring 2FA Authentication is getting done in three steps:<br /><br />
                                            <b>Step One</b><br />
                                            Donwload an OTP App like Google Authenticator or Microsoft Authenticator<br /><br />
                                            <b>Step Two</b><br />
                                            Scan the barcode, shown below, with your OTP Authenticator app or enter the the secret manually in your Authenticator app<br /><br />
                                            <b>Step Three</b><br />
                                            Insert the OTP Code shown by your Authenticator App into the number fields below and click the "Verfify my code" button<br /><br />

                                        </Box>
                                        <form onSubmit={verifyOtp}>
                                            <HStack>
                                                <div style={{ height: "auto", maxWidth: 150, marginLeft: '15px', width: "100%", textAlign: 'left' }}>
                                                    <QRCode value={qrcodeUrl} size={128} />
                                                </div>
                                                <VStack style={{ height: '128px', minHeight: '128px !important', paddingLeft: '20px' }} verticalAlign={'top'} align={'left'}>
                                                    <Text align={'left'}><b>Your OTP Secret</b></Text>
                                                    <Text align={'left'}>{totpSecret ? totpSecret : 'secret here..'}</Text>
                                                </VStack>
                                            </HStack>
                                            <HStack mt={'20px'} mb={'20px'} >
                                                <PinInput otp colorScheme="blue" autoFocus={true} onChange={(e) => handleChange(e)}>
                                                    <PinInputField mr={'30px'} ml={'10px'} />
                                                    <PinInputField mr={'30px'} />
                                                    <PinInputField mr={'30px'} />
                                                    <PinInputField mr={'30px'} />
                                                    <PinInputField mr={'30px'} />
                                                    <PinInputField />
                                                </PinInput>
                                            </HStack>

                                            <HStack spacing={6} mt={'30px'}>

                                                <Button type="Button" onClick={() => navigate("/Home")} mr={'3'} >Cancel</Button>
                                                <Button
                                                    width={'100%'}
                                                    type="submit"
                                                    colorScheme={'blue'}
                                                    variant={'solid'}
                                                    isLoading={isLoading}
                                                    loadingText='verifing...'
                                                >
                                                    Verify my code now..
                                                </Button>
                                            </HStack>
                                        </form>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </>
        )
    }
}
export default MfaSetup;