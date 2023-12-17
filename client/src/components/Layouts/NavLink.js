import { Flex, Icon, useColorModeValue, Box } from "@chakra-ui/react";
import { MdExpandMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
export default function NavLink({ link, ...rest }) {
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
        <Flex align="center" w={"100%"} fontWeight={window.location.pathname.indexOf(link.label) > -1 ? "bold" : "normal"}>
          {icon && (
            <Icon
              mr="2"
              fontSize="18"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {label}
        </Flex>
        {link.childrens && (
          <Flex align="center" justifyContent={"end"}>
            <Icon mr="0" fontSize="18" as={MdExpandMore} />
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
