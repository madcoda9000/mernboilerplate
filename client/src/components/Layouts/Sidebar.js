import { useEffect } from "react";
import { Box, CloseButton, Flex, Text, VStack, useColorModeValue, useBoolean } from "@chakra-ui/react";
import { MdSettings, MdOutlineKey, MdImportExport, MdPerson2, MdPeople, MdOutlineMarkEmailRead, MdHome, MdOutlineListAlt, MdOutlineList } from "react-icons/md";
import NavLink from "./NavLink";
import SubNavLink from "./SubNavLink";
import AuthContext from "../../components/shared/Auth/AuthContext";
import { useContext } from "react";

export default function Sidebar({ remaining, onClose, ...rest }) {
  const [hideSubMenu1, setHideSubmenu1] = useBoolean(window.location.pathname.indexOf("Secrets") > -1 ? false : true);
  const [hideSubMenu2, setHideSubmenu2] = useBoolean(window.location.pathname.indexOf("Admin") > -1 ? false : true);
  const [hideSubMenu3, setHideSubmenu3] = useBoolean(window.location.pathname.indexOf("Settings") > -1 ? false : true);
  const [hideSubMenu4, setHideSubmenu4] = useBoolean(window.location.pathname.indexOf("Logs") > -1 ? false : true);
  const { user } = useContext(AuthContext);

  const LinkItems = [
    {
      label: "Home",
      icon: MdHome,
      href: "/Home",
      admin: false,
    },
    {
      trigger: setHideSubmenu1,
      label: "Secrets",
      icon: MdOutlineKey,
      href: "#",
      admin: false,
      childrens: [
        {
          hider: hideSubMenu1,
          label: "Import",
          icon: MdImportExport,
          href: "/",
          admin: true,
        },
        {
          hider: hideSubMenu1,
          label: "Export",
          icon: MdImportExport,
          href: "/",
          admin: true,
        },
      ],
    },
    {
      trigger: setHideSubmenu2,
      label: "Administration",
      icon: MdSettings,
      href: "#",
      admin: true,
      childrens: [
        {
          hider: hideSubMenu2,
          label: "Users",
          icon: MdPerson2,
          href: "/Admin/Users",
          admin: true,
        },
        {
          hider: hideSubMenu2,
          label: "Roles",
          icon: MdPeople,
          href: "/Admin/Roles",
          admin: true,
        },
        {
          hider: hideSubMenu2,
          label: "Email Service",
          icon: MdOutlineMarkEmailRead,
          href: "/",
          admin: true,
        },
      ],
    },
    {
      trigger: setHideSubmenu3,
      label: "Settings",
      icon: MdSettings,
      href: "#",
      admin: true,
      childrens: [
        {
          hider: hideSubMenu3,
          label: "Mailsettingse",
          icon: MdOutlineMarkEmailRead,
          href: "/",
          admin: true,
        },
        {
          hider: hideSubMenu3,
          label: "Appsettings",
          icon: MdOutlineMarkEmailRead,
          href: "/Admin/AppSettings",
          admin: true,
        },
        {
          hider: hideSubMenu3,
          label: "LDAP-Settings",
          icon: MdOutlineMarkEmailRead,
          href: "/",
          admin: true,
        },
        {
          hider: hideSubMenu3,
          label: "Notifications",
          icon: MdOutlineMarkEmailRead,
          href: "/",
          admin: true,
        },
      ],
    },
    {
      trigger: setHideSubmenu4,
      label: "Logs",
      icon: MdOutlineList,
      href: "#",
      admin: true,
      childrens: [
        {
          hider: hideSubMenu4,
          label: "Systemlogs",
          icon: MdOutlineListAlt,
          href: "/Admin/SystemLogs",
          admin: true,
        },
        {
          hider: hideSubMenu4,
          label: "RequestLogs",
          icon: MdOutlineListAlt,
          href: "/Admin/RequestLogs",
          admin: true,
        },
        {
          hider: hideSubMenu4,
          label: "Auditlogs",
          icon: MdOutlineListAlt,
          href: "/Admin/AuditLogs",
          admin: true,
        },
      ],
    },
  ];

  useEffect(() => {
    /*
    if(window.location.pathname.indexOf("Admin") > -1) {
      setHideSubmenu2.toggle();
    }
    if(window.location.pathname.indexOf("Settings") > -1) {
      setHideSubmenu3.toggle();
    }
    if(window.location.pathname.indexOf("Logs") > -1) {
      setHideSubmenu4.toggle();
    }
    */
  }, [setHideSubmenu2, setHideSubmenu3, setHideSubmenu4]);

  return (
    <Box
      id="mSidebar"
      transition="0.5s ease"
      bg={useColorModeValue("gray.500", "gray.500")}
      color={useColorModeValue("white", "gray.800")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color={useColorModeValue("white", "gray.200")}>
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} color={useColorModeValue("white", "gray.200")} />
      </Flex>
      <VStack>
        <Box mt={2} ml={0} w={"100%"}>
          {LinkItems.map((link, i) => (
            <div key={i}>
              {link.childrens ? (
                <Box
                  ml={0}
                  mb={2}
                  w={"100%"}
                  onClick={link.trigger.toggle}
                  transition="3s ease"
                  display={link.admin === true && !user.roles.includes("admins") ? "none" : "display"}
                >
                  <NavLink link={link} />
                  {link.childrens && (
                    <Box w={"90%"} ml={6} transition="3s ease">
                      {link.childrens.map((child, ci) => (
                        <SubNavLink
                          fontWeight={window.location.pathname.indexOf(child.label) > -1 ? "bold" : "normal"}
                          key={ci}
                          link={child}
                          hidden={child.hider}
                          display={child.admin === true && !user.roles.includes("admins") ? "none" : "display"}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box key={i} ml={0} mb={2} w={"100%"} display={link.admin === true && !user.roles.includes("admins") ? "none" : "display"}>
                  <NavLink link={link} />
                </Box>
              )}
            </div>
          ))}
        </Box>
      </VStack>
      <Box className="sidebarFooter">
        <Text color={"gray.400"}>Idle Timeout in: {remaining}</Text>
      </Box>
    </Box>
  );
}
