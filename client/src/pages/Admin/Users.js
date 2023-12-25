import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RoleChecker from "../../components/shared/Auth/RoleChecker";
import RoleBadges from "../../components/shared/UI/RoleBadges";
import ComponentWithForwardRef from "../../components/shared/UI/ComponentWithForwardRef";
import { useEffect, useState } from "react";
import UsersService from "../../Services/UsersService";
import Paginator from "../../components/shared/UI/Paginator";
import { useSearchDebounce } from "../../components/shared/Utils";
import MAlertDialog from "../../components/shared/Dialogs/Alert";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  TableContainer,
  Alert,
  Tooltip,
  AlertIcon,
  Box,
  CircularProgress,
  Center,
  Heading,
  useMediaQuery,
  HStack,
  Button,
  IconButton,
  Flex,
  Spacer,
  InputLeftElement,
  InputRightAddon,
  InputGroup,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  MdOutlinePeople,
  MdEdit,
  MdDelete,
  MdOutlineSearch,
  MdCheckCircle,
  MdDoDisturbOn,
  MdMail,
  MdMailLock,
  MdOutlinePerson,
  MdCircle,
} from "react-icons/md";
import AuthContext from "../../components/shared/Auth/AuthContext";
import { makeAuditEntry } from "../../components/shared/Utils";
import ToastBox from "../../components/shared/UI/ToastBox.js";
import MfaChecker from "../../components/shared/Auth/MfaChecker.js";

const Users = () => {
  const [usersData, setUsersData] = useState(null);
  const [isLoading, SetIsLoading] = useState(true);
  const [errMsg, SetErrMsg] = useState(null);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const [search, setSearch] = useSearchDebounce();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMAlertLoading, SetIsMAlertLoading] = useState(false);
  const navigate = useNavigate();
  const [selUserId, setSelUserId] = useState();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const toastIdRef = useRef();

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  useEffect(() => {
    SetIsLoading(true);
    makeAuditEntry(user.userName, "info", "viewed all users listing");
    var pSize = 100;
    var searchStr = "";
    if (search === null || search.trim() === "" || search.trim().length === 0) {
      pSize = 10;
    } else {
      searchStr = search;
    }
    UsersService.getUsersPaginated(1, pSize, searchStr).then((response) => {
      if (!response.error) {
        setUsersData(response.data.paginatedResult);
        SetIsLoading(false);
        setSelectedPage(response.data.paginatedResult.page);
      } else {
        SetErrMsg(response.data.message);
        SetIsLoading(false);
      }
    });
  }, [search, user.userName]);

  const LoadData = (page, pageSize) => {
    SetIsLoading(true);
    UsersService.getUsersPaginated(page, pageSize, "").then((response) => {
      if (!response.error) {
        setUsersData(response.data.paginatedResult);
        SetIsLoading(false);
        setSelectedPage(response.data.paginatedResult.page);
      } else {
        SetErrMsg(response.data.message);
        SetIsLoading(false);
      }
    });
  };

  const EditUser = (id) => {
    navigate("/Admin/UsersEdit/" + id);
  };

  const PrevPage = () => {
    var np = selectedPage;
    np--;
    LoadData(np, selectedPageSize);
  };

  const NextPage = () => {
    var np = selectedPage;
    np++;
    LoadData(np, selectedPageSize);
  };

  const ChangePageSize = (pageSize) => {
    setSelectedPageSize(pageSize);
    LoadData(1, pageSize);
  };

  const openDialog = (id) => {
    setSelUserId(id);
    onOpen();
  };

  const DisableMfa = (userId, userName) => {
    if (userId && userName) {
      let payload = {
        _id: userId,
        execUserId: user._id,
      };
      UsersService.disableMfa(payload).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          LoadData(1, 10, "");
          makeAuditEntry(user.userName, "info", "disabled 2fa authentication for user " + userName);

          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
    }
  };

  const EnableLdap = (userId, userName) => {
    if (userId && userName) {
      let payload = {
        _id: userId,
      };
      UsersService.enableLdap(payload).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          LoadData(1, 10, "");
          makeAuditEntry(user.userName, "info", "enabled ldap authentication for user " + userName);

          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
    }
  };

  const DisableLdap = (userId, userName) => {
    if (userId && userName) {
      let payload = {
        _id: userId,
      };
      UsersService.disableLdap(payload).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          LoadData(1, 10, "");
          makeAuditEntry(user.userName, "info", "disabled ldap authentication for user " + userName);

          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
    }
  };

  const EnforceMfa = (userId, userName) => {
    if (userId && userName) {
      let payload = {
        _id: userId,
      };
      UsersService.enableMfaEnforce(payload).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          LoadData(1, 10, "");
          makeAuditEntry(user.userName, "info", "enabled 2fa enforcement for user " + userName);

          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
    }
  };

  const UnEnforceMfa = (userId, userName) => {
    if (userId && userName) {
      let payload = {
        _id: userId,
      };
      UsersService.disableMfaEnforce(payload).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          LoadData(1, 10, "");
          makeAuditEntry(user.userName, "info", "disabled 2fa enforcement for user " + userName);

          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
    }
  };

  const VerifyEmail = (userId) => {};

  const LockAccount = (userId, userName) => {
    if (userId && userName) {
      let payload = {
        _id: userId,
      };
      UsersService.lockUser(payload).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          LoadData(1, 10, "");
          makeAuditEntry(user.userName, "warn", "locked user account " + userName);

          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
    }
  };

  const UnlockAccount = (userId, userName) => {
    if (userId && userName) {
      let payload = {
        _id: userId,
      };
      UsersService.unlockUser(payload).then((response) => {
        if (response.data.error) {
          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        } else {
          LoadData(1, 10, "");
          makeAuditEntry(user.userName, "warn", "unlocked user account " + userName);

          toastIdRef.current = toast({
            position: "bottom-right",
            render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
          });
        }
      });
    }
  };

  const DeleteUser = (id) => {
    SetIsMAlertLoading(true);
    let paylod = {
      _id: id,
    };
    UsersService.deleteUser(paylod).then((response) => {
      if (!response.error) {
        makeAuditEntry(user.userName, "warn", "deleted user " + id);
        onClose();
        LoadData(1, 10);
      } else {
        SetErrMsg(response.message);
      }
    });
    SetIsMAlertLoading(false);
    onClose();
  };

  return (
    <>
      {isLoading && !usersData ? (
        <>
          <MfaChecker />
          <RoleChecker requiredRole="admins" />
          <Center width={"100%"} mt={40}>
            <CircularProgress isIndeterminate color="blue.500" />
          </Center>
        </>
      ) : (
        <>
          {isLargerThan500 ? (
            <>
              <MfaChecker />
              <RoleChecker requiredRole="admins" />
              {errMsg && (
                <Alert status="error" colorScheme={"red"} variant={"left-accent"}>
                  <AlertIcon />
                  {errMsg}
                </Alert>
              )}
              <HStack>
                <Box></Box>
                <Flex width={"100%"}>
                  <HStack>
                    <Icon as={MdOutlinePerson} display={"inline"} mr={"10px"} w={10} h={10} />
                    <Heading fontSize={"2xl"} display={"inline"}>
                      Manage Users...
                    </Heading>
                  </HStack>
                  <Spacer />
                  <HStack>
                    <InputGroup borderRadius={5} size="sm">
                      <InputLeftElement pointerEvents="none" children={<MdOutlineSearch color="gray.600" />} />
                      <Input type="text" placeholder={search ? search : "search..."} onChange={(e) => setSearch(e.target.value)} />
                      <InputRightAddon p={0} border="none">
                        <Button
                          size="sm"
                          borderLeftRadius={0}
                          borderRightRadius={0}
                          type="button"
                          colorScheme={"gray"}
                          variant={"solid"}
                          onClick={() => setSearch("")}
                        >
                          {search ? "reset" : "search"}
                        </Button>
                        <Button
                          size="sm"
                          borderLeftRadius={0}
                          borderLeft={"1px solid var(--chakra-colors-gray-300)"}
                          type="button"
                          colorScheme={"green"}
                          variant={"solid"}
                          onClick={() => navigate("/Admin/UserNew")}
                        >
                          create new User
                        </Button>
                      </InputRightAddon>
                    </InputGroup>
                  </HStack>
                </Flex>
              </HStack>
              <TableContainer mb={"30px"} mt={"30px"}>
                <Table variant="striped" colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th>Acc</Th>
                      <Th>Mail</Th>
                      <Th>2FA</Th>
                      <Th>2fa Enf</Th>
                      <Th>Ldap</Th>
                      <Th>Username</Th>
                      <Th>Roles</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {usersData.docs.map((user, i) => (
                      <Tr key={i}>
                        {user.userName === "super.admin" ? (
                          <Td>
                            <Tooltip label="Account activated! You cannot disable this account." fontSize="sm">
                              <ComponentWithForwardRef>
                                <Icon as={MdDoDisturbOn} color="green.200" />
                              </ComponentWithForwardRef>
                            </Tooltip>
                          </Td>
                        ) : (
                          <Td width={"30px"}>
                            {user.accountLocked ? (
                              <Tooltip label="Account locked! Click to unlock." fontSize="sm">
                                <ComponentWithForwardRef>
                                  <Icon
                                    onClick={() => UnlockAccount(user._id, user.userName)}
                                    style={{ cursor: "pointer" }}
                                    as={MdDoDisturbOn}
                                    color="red.500"
                                  />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            ) : (
                              <Tooltip label="Account active! Click to lock account." fontSize="sm">
                                <ComponentWithForwardRef>
                                  <Icon
                                    onClick={() => LockAccount(user._id, user.userName)}
                                    style={{ cursor: "pointer" }}
                                    as={MdCheckCircle}
                                    color="green.500"
                                  />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            )}
                          </Td>
                        )}
                        {user.userName === "super.admin" ? (
                          <Td>
                            <Tooltip label="Email address verified! super.admin is always verified!" fontSize="sm">
                              <ComponentWithForwardRef>
                                <Icon as={MdDoDisturbOn} color="green.200" />
                              </ComponentWithForwardRef>
                            </Tooltip>
                          </Td>
                        ) : (
                          <Td width={"30px"}>
                            {user.emailVerified ? (
                              <Tooltip label="Email address verified!" fontSize="sm">
                                <ComponentWithForwardRef>
                                  <Icon as={MdMail} color="green.500" />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            ) : (
                              <Tooltip label="Email address unverified! Click to verify." fontSize="sm">
                                <ComponentWithForwardRef>
                                  <Icon style={{ cursor: "pointer" }} onClick={() => VerifyEmail(user._id)} as={MdMailLock} color="red.500" />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            )}
                          </Td>
                        )}
                        <Td width={"30px"}>
                          {user.mfaEnabled ? (
                            <Tooltip label="2FA Authentication enabled! Click to disable." fontSize="sm">
                              <ComponentWithForwardRef>
                                <Icon onClick={() => DisableMfa(user._id, user.userName)} style={{ cursor: "pointer" }} as={MdCheckCircle} color="green.500" />
                              </ComponentWithForwardRef>
                            </Tooltip>
                          ) : (
                            <Tooltip label="2FA Authentication disabled!" fontSize="sm">
                              <ComponentWithForwardRef>
                                <Icon as={MdCircle} color="red.500" />
                              </ComponentWithForwardRef>
                            </Tooltip>
                          )}
                        </Td>
                        {user.userName === "super.admin" ? (
                          <Td width={"30px"}>
                            <Tooltip label="2FA Authentication not enforced! Cannot be enforced for super.admin." fontSize="sm">
                              <ComponentWithForwardRef>
                                <Icon as={MdDoDisturbOn} color="gray.400" />
                              </ComponentWithForwardRef>
                            </Tooltip>
                          </Td>
                        ) : (
                          <Td width={"30px"}>
                            {user.mfaEnforced ? (
                              <Tooltip label="2FA Authentication enforced! Click to unenforce." fontSize="sm">
                                <ComponentWithForwardRef>
                                  <Icon
                                    onClick={() => UnEnforceMfa(user._id, user.userName)}
                                    style={{ cursor: "pointer" }}
                                    as={MdCheckCircle}
                                    color="yellow.500"
                                  />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                label={
                                  user.mfaEnabled
                                    ? "2FA Authentication not enforced as 2fa is enabled already!"
                                    : "2FA Authentication not enforced! Click to enforce"
                                }
                                fontSize="sm"
                              >
                                <ComponentWithForwardRef>
                                  {user.mfaEnabled === true || user.userName === "super.admin" ? (
                                    <Icon as={MdCircle} color="gray.500" />
                                  ) : (
                                    <Icon onClick={() => EnforceMfa(user._id, user.userName)} as={MdCircle} style={{ cursor: "pointer" }} color="gray.500" />
                                  )}
                                </ComponentWithForwardRef>
                              </Tooltip>
                            )}
                          </Td>
                        )}
                        {user.userName === "super.admin" ? (
                          <Td width={"30px"}>
                            <Tooltip label="Ldap not enabled! Cannot be enabled for super.admin." fontSize="sm">
                              <ComponentWithForwardRef>
                                <Icon as={MdDoDisturbOn} color="gray.400" />
                              </ComponentWithForwardRef>
                            </Tooltip>
                          </Td>
                        ) : (
                          <Td width={"30px"}>
                            {user.ldapEnabled ? (
                              <Tooltip label="Ldap Authentication enabled! Click to disable." fontSize="sm">
                                <ComponentWithForwardRef>
                                  <Icon onClick={() => DisableLdap(user._id, user.userName)} as={MdCircle} style={{ cursor: "pointer" }} color="green.500" />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            ) : (
                              <Tooltip label="Ldap Authentication disabled! Click to enable." fontSize="sm">
                                <ComponentWithForwardRef>
                                  <Icon onClick={() => EnableLdap(user._id, user.userName)} as={MdCircle} style={{ cursor: "pointer" }} color="gray.500" />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            )}
                          </Td>
                        )}
                        <Td width={"200px"}>{user.userName}</Td>
                        <Td width={"100%"}>{RoleBadges(user.roles)}</Td>
                        <Td>
                          <HStack>
                            <Tooltip label="Edit user..." fontSize="sm">
                              <ComponentWithForwardRef>
                                <IconButton
                                  onClick={() => EditUser(user._id)}
                                  mr={"5px"}
                                  size={"xs"}
                                  aria-label="Edit user..."
                                  icon={<MdEdit />}
                                  backgroundColor={"yellow.500"}
                                  color={"white"}
                                  isRound={true}
                                  variant="solid"
                                  colorScheme="yellow"
                                />
                              </ComponentWithForwardRef>
                            </Tooltip>
                            {user.userName === "super.admin" ? (
                              <Tooltip label="Delete user..." fontSize="sm">
                                <ComponentWithForwardRef>
                                  <IconButton
                                    isDisabled={user.userName === "super.admin"}
                                    size={"xs"}
                                    aria-label="Delete user..."
                                    icon={<MdDelete />}
                                    backgroundColor={"red.500"}
                                    color={"white"}
                                    isRound={true}
                                    variant="solid"
                                    colorScheme="red"
                                  />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            ) : (
                              <Tooltip label="Delete user..." fontSize="sm">
                                <ComponentWithForwardRef>
                                  <IconButton
                                    onClick={() => openDialog(user._id)}
                                    size={"xs"}
                                    aria-label="Delete user..."
                                    icon={<MdDelete />}
                                    backgroundColor={"red.500"}
                                    color={"white"}
                                    isRound={true}
                                    variant="solid"
                                    colorScheme="red"
                                  />
                                </ComponentWithForwardRef>
                              </Tooltip>
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box width={"100%"}>
                <Paginator
                  pageSize={usersData.limit}
                  totalPages={usersData.pages}
                  currentPage={usersData.page}
                  nextPageMethod={NextPage}
                  prevPageMethod={PrevPage}
                  totalItems={usersData.total}
                  pageSizeMethod={ChangePageSize}
                />
              </Box>

              <MAlertDialog
                dialogType="danger"
                isOpen={isOpen}
                onClose={onClose}
                onAction={() => DeleteUser(selUserId)}
                headerText="Delete User?"
                bodyText={{ __html: "Do you really want to delete this user? You can't undo this action afterwards." }}
                cancelButtonText="Cancel"
                actionButtonText="Yes, delete the user!"
                isButtonLoading={isMAlertLoading}
                isButtonLoadingText="deleting user.."
              />
            </>
          ) : (
            <>
              <HStack>
                <Icon as={MdOutlinePeople} color={"blue.500"} display={"inline"} mr={"10px"} w={10} h={10} />
                <Heading fontSize={"2xl"} display={"inline"}>
                  Manage Users...
                </Heading>
              </HStack>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Users;
