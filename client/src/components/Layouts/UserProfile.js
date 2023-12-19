import { Avatar, Box, Flex, HStack, VStack, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorModeValue } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import DarkModeSwitcher from "../../components/shared/UI/DarkModeSwitcher";
import AuthContext from "../../components/shared/Auth/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import RoleBadges from "../shared/UI/RoleBadges";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const NavTo = (page) => {
    navigate("/" + page);
  };

  return (
    <HStack spacing={{ base: "0", md: "6" }}>
      <Flex alignItems="center">
        <Menu>
          <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
            <HStack spacing="4">
              <Avatar size="md" src={"/images/avatar.jpg"} />
              <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                <Text fontSize="lg">
                  {user.firstName} {user.lastName}
                </Text>
                <Text fontSize="md" color={useColorModeValue("gray.500", "gray.500")}>
                  {RoleBadges(user.roles)}
                </Text>
              </VStack>
              <Box display={{ base: "none", md: "flex" }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList fontSize="lg" bg={useColorModeValue("white", "gray.800")}>
            <MenuItem
              bg={useColorModeValue("white", "gray.800")}
              _hover={{
                bg: useColorModeValue("gray.50", "gray.600"),
              }}
              onClick={() => NavTo("Profile")}
            >
              Profile
            </MenuItem>
            <MenuItem
              bg={useColorModeValue("white", "gray.800")}
              _hover={{
                bg: useColorModeValue("gray.50", "gray.600"),
              }}
              onClick={() => NavTo("MfaSetup")}
            >
              <span>{user.mfaEnabled === true ? "Disable 2FA" : "Setup 2FA"}</span>
            </MenuItem>
            <MenuItem
              bg={useColorModeValue("white", "gray.800")}
              _hover={{
                bg: useColorModeValue("gray.50", "gray.600"),
              }}
            >
              Darkmode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DarkModeSwitcher showSwitch={true} position={"static"} />
            </MenuItem>
            <MenuDivider />
            <MenuItem
              bg={useColorModeValue("white", "gray.800")}
              _hover={{
                bg: useColorModeValue("gray.50", "gray.600"),
              }}
              onClick={logout}
            >
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  );
}
