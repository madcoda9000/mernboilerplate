import { Flex, Icon, useColorModeValue, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function SubNavLink({ link, ...rest }) {
  const { label, icon, href } = link;
  const nav = useNavigate();

  return (
    <Box onClick={() => nav(href)}>
      <Flex
        align="center"
        p="2"
        mx="6"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={useColorModeValue("white", "gray.200")}
        _hover={{
          bg: "gray.600",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="2"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {label}
      </Flex>
    </Box>
  );
}
