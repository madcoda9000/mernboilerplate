import { useState, useEffect, useCallback, useContext } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box, Drawer, DrawerContent, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Text } from "@chakra-ui/react";
import { useIdleTimer } from "react-idle-timer";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../components/shared/Auth/AuthContext";

const timeout = 120_000;
const promptBeforeIdle = 30_000;

export default function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ml, setMl] = useState({ base: 0, md: 60 });
  const [sideBarDisplay, setSideBarDisplay] = useState("block");
  const [remaining, setRemaining] = useState(timeout);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Memoized callback functions
  const onIdle = useCallback(() => {
    setOpen(false);
    logout();
  }, [logout]);

  const onActive = useCallback(() => {
    setOpen(false);
  }, []);

  const onPrompt = useCallback(() => {
    setOpen(true);
  }, []);

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500,
  });

  // Memoized interval function
  const updateRemainingTime = useCallback(() => {
    let remainingSeconds = Math.ceil(getRemainingTime() / 1000);
    let remainingDisplayString = "";
    if (remainingSeconds > 60) {
      let secs = remainingSeconds % 60;
      let secStr = secs;
      if (secs < 10) {
        secStr = "0" + secs;
      }
      let mins = Math.floor(remainingSeconds / 60);
      let minsStr = mins;
      if (mins < 10) {
        minsStr = "0" + mins;
      }
      remainingDisplayString = minsStr + ":" + secStr;
    } else {
      remainingDisplayString = "00:" + remainingSeconds;
    }
    setRemaining(remainingDisplayString);
  }, [getRemainingTime]);

  useEffect(() => {
    const interval = setInterval(updateRemainingTime, 500);
    return () => clearInterval(interval);
  }, [updateRemainingTime]);

  const handleStillHere = () => {
    activate();
  };

  const ToggleSidebar = () => {
    if (ml.md === 60) {
      setMl({ base: 0, md: 0 });
      setSideBarDisplay("none");
    } else {
      setMl({ base: 0, md: 60 });
      setSideBarDisplay("block");
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("white", "gray.800")}>
      {/*= SIDEBAR =*/}
      <Sidebar remaining={remaining} onClose={() => onClose} display={{ base: "none", md: sideBarDisplay }} />
      <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/*= HEADER =*/}
      <Header onOpen={onOpen} ml={ml} toggleSidebar={ToggleSidebar} bg={useColorModeValue("#fcfcfc", "gray.800")} />
      <Box ml={ml} p="7" bg={useColorModeValue("white", "gray.800")}>
        {/*= CONTENT =*/}
        <Outlet></Outlet>
      </Box>

      <AlertDialog isOpen={open} closeOnOverlayClick={false} isCentered motionPreset="slideInTop">
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" backgroundColor={"red.500"} color={"white"}>
              Session Timeout
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>Your session is about to expire soon. Due to security reasons your session will be terminated automatiically in a few seconds.</Text>
              <Text mt={3}>
                Automatic logout in:{" "}
                <span style={{ color: "#E53E3E", fontWeight: "bold" }} id="dtime">
                  {remaining}
                </span>
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleStillHere}>No, retain my session!</Button>
              <Button colorScheme="red" onClick={() => navigate("/login?msg=lgo")} ml={3}>
                Yes, please Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
