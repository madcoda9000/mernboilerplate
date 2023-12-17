import { useNavigate } from "react-router-dom";
import RoleChecker from "../../components/shared/Auth/RoleChecker";
import React, { useContext, useEffect, useState } from "react";
import RolesService from "../../Services/RolesService.js";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  Spacer,
  VStack,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { MdOutlinePeople, MdOutlineWarning } from "react-icons/md";
import ToastBox from "../../components/shared/UI/ToastBox.js";
import AuthContext from "../../components/shared/Auth/AuthContext";
import { makeAuditEntry } from "../../components/shared/Utils";

const RoleNew = () => {
  const [btnPwIsloading, setbtnPwIsloading] = useState(false);
  const [newRole, setNewRole] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const navigate = useNavigate();
  const toast = useToast();
  const toastIdRef = React.useRef();
  const { user } = useContext(AuthContext);

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  useEffect(() => {
    var nu = {
      roleName: "",
    };
    if (!newRole) {
      setNewRole(nu);
    }
  }, [newRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prevData) => ({ ...prevData, [name]: value }));
  };

  const ValidateForm = () => {
    let hasError = false;
    let errmMsg = "<ul style='margin-left:20px;'>";

    const { roleName } = newRole;

    const addError = (message) => {
      hasError = true;
      errmMsg += `<li>${message}</li>`;
    };

    if (!roleName.trim()) {
      addError("Please enter a role name!");
    }

    if (hasError) {
      errmMsg += "</ul>";
      setErrMsg({ __html: errmMsg });
    }

    return hasError;
  };

  const SaveRole = () => {
    if (!ValidateForm()) {
      setbtnPwIsloading(true);
      RolesService.createRole(newRole).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          makeAuditEntry(user.userName, "info", "created new role " + newRole);
          var nu = {
            roleName: "",
          };
          setNewRole(nu);
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
      setbtnPwIsloading(false);
    }
  };

  return (
    <>
      <RoleChecker requiredRole="admins" />
      {!newRole ? (
        <Center width={"100%"} mt={40}>
          <CircularProgress isIndeterminate color="blue.500" />
        </Center>
      ) : (
        <>
          {isLargerThan500 ? (
            <>
              <HStack>
                <Icon as={MdOutlinePeople} display={"inline"} mr={"10px"} w={10} h={10} />
                <Heading fontSize={"2xl"} display={"inline"}>
                  Create new Role...
                </Heading>
              </HStack>

              <Flex>
                <Box w={"60%"} paddingRight={"30px"} mt={"30px"}>
                  {errMsg && (
                    <div
                      className="chakra-alert"
                      data-status="error"
                      role="alert"
                      style={{ backgroundColor: "var(--chakra-colors-red-600)", padding: "15px", color: "var(--chakra-colors-white)", marginTop: "20px" }}
                    >
                      <HStack>
                        <Icon as={MdOutlineWarning} display={"inline"} mr={"10px"} w={6} h={6} mb={3} />
                        <Heading fontSize={"lg"} style={{ marginBottom: "10px" }}>
                          Please correct the following errors..
                        </Heading>
                      </HStack>
                      <div dangerouslySetInnerHTML={errMsg}></div>
                    </div>
                  )}
                  <VStack alignItems={"left"}>
                    <FormControl id="userName" style={{ marginTop: "20px" }}>
                      <FormLabel>Name for the new role...</FormLabel>
                      <Input type="text" name="roleName" onChange={(e) => handleChange(e)} value={newRole.roleName} />
                    </FormControl>
                  </VStack>
                  <HStack mt={"30px"}>
                    <Spacer />
                    <Button mr={"30px"} onClick={() => navigate("/Admin/Roles")}>
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      colorScheme={"gray"}
                      variant={"solid"}
                      isLoading={btnPwIsloading}
                      disabled={btnPwIsloading}
                      loadingText="Saving..."
                      onClick={() => SaveRole()}
                    >
                      Save role...
                    </Button>
                  </HStack>
                </Box>
              </Flex>
            </>
          ) : (
            <>is mobile!</>
          )}
        </>
      )}
    </>
  );
};

export default RoleNew;
