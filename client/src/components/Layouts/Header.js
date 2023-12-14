import { IconButton, Flex, Center, Text, useColorModeValue } from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";
import UserProfile from "./UserProfile";

export default function Header({ onOpen, ml, toggleSidebar, ...rest }) {
  return (
    <Flex
      ml={ml}
      px="4"
      position="sticky"
      top="0"
      height="20"
      zIndex="1"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      bg={useColorModeValue('white', 'gray.800')}
      {...rest}
    >
      <Center justifyContent={{ base: "flex-start", md: "flex-start" }} >
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="ghost"
          aria-label="open menu"
          icon={<MdMenu />}
        />

        <IconButton
          display={{ base: "none", md: "flex" }}
          onClick={toggleSidebar}
          variant="ghost"
          aria-label="open menu"
          icon={<MdMenu />}
        />
      </Center>
      <Center flex='1'>
      <Text
        display={{ base: "block", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>
      </Center>
      <Center justifyContent={{ base: "flex-end", md: "flex-end" }} >
        <UserProfile />
      </Center> 
    </Flex>
  );
}