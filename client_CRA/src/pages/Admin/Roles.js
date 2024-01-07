import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import RoleChecker from "../../components/shared/Auth/RoleChecker";
import ComponentWithForwardRef from "../../components/shared/UI/ComponentWithForwardRef";
import { useEffect, useState } from "react";
import RolesService from "../../Services/RolesService";
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
  CloseButton,
  useToast,
} from "@chakra-ui/react";
import { MdOutlinePeople, MdDelete, MdOutlineSearch } from "react-icons/md";
import ToastBox from "../../components/shared/UI/ToastBox";
import AuthContext from "../../components/shared/Auth/AuthContext";
import { makeAuditEntry } from "../../components/shared/Utils";
import MfaChecker from "../../components/shared/Auth/MfaChecker";

const Roles = () => {
  const [RolesData, setRolesData] = useState(null);
  const [isLoading, SetIsLoading] = useState(true);
  const [errMsg, SetErrMsg] = useState(null);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const [search, setSearch] = useSearchDebounce();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMAlertLoading, SetIsMAlertLoading] = useState(false);
  const navigate = useNavigate();
  const [selRoleId, setSelRoleId] = useState();
  const toast = useToast();
  const toastIdRef = React.useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    SetIsLoading(true);

    var pSize = 100;
    var searchStr;
    if (search === null || search.trim() === "" || search.trim().length === 0) {
      pSize = 10;
      searchStr = "";
    } else {
      searchStr = search;
    }
    RolesService.getRoles(1, pSize, searchStr).then((response) => {
      if (!response.error) {
        setRolesData(response.data.paginatedResult);
        SetIsLoading(false);
        setSelectedPage(response.data.paginatedResult.page);
        makeAuditEntry(user.userName, "info", "viewed user roles listing");
      } else {
        SetErrMsg(response.data.message);
        SetIsLoading(false);
      }
    });
  }, [search, user.userName]);

  const LoadData = (page, pageSize) => {
    SetIsLoading(true);
    RolesService.getRoles(page, pageSize, "").then((response) => {
      if (!response.error) {
        setRolesData(response.data.paginatedResult);
        SetIsLoading(false);
        setSelectedPage(response.data.paginatedResult.page);
      } else {
        SetErrMsg(response.data.message);
        SetIsLoading(false);
      }
    });
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
    setSelRoleId(id);
    onOpen();
  };

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const DeleteRole = (id) => {
    SetIsMAlertLoading(true);
    let paylod = {
      _id: id,
    };
    RolesService.deleteRole(paylod).then((response) => {
      if (!response.data.error) {
        makeAuditEntry(user.userName, "warn", "deleted role " + id);
        onClose();
        LoadData(1, 10);
        toastIdRef.current = toast({
          position: "bottom-right",
          render: () => <ToastBox alertBgColor={"green.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
        });
      } else {
        //SetErrMsg(response.data.message);
        toastIdRef.current = toast({
          position: "bottom-right",
          render: () => <ToastBox alertBgColor={"red.500"} alertTextColor={"white"} alertMessage={response.data.message} onClose={() => closeToast()} />,
        });
      }
    });
    SetIsMAlertLoading(false);
    onClose();
  };

  return (
    <>
      {isLoading && !RolesData ? (
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
              <HStack>
                <Flex width={"100%"}>
                  <HStack>
                    <Icon as={MdOutlinePeople} display={"inline"} mr={"10px"} w={10} h={10} />
                    <Heading fontSize={"2xl"} display={"inline"}>
                      Manage Roles...
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
                          onClick={() => navigate("/Admin/RoleNew")}
                        >
                          create new Role
                        </Button>
                      </InputRightAddon>
                    </InputGroup>
                  </HStack>
                </Flex>
              </HStack>
              {errMsg && (
                <Alert status="error" variant={"solid"} mt={7}>
                  <AlertIcon />
                  <Box>{errMsg}</Box>
                  <CloseButton alignSelf="flex-end" position="absolute" right={2} top={2} onClick={() => SetErrMsg(null)} />
                </Alert>
              )}
              <TableContainer mb={"30px"} mt={"30px"}>
                <Table variant="striped" colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th>id</Th>
                      <Th>Name</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {RolesData.docs.map((role, i) => (
                      <Tr key={i}>
                        <Td width={"200px"}>{role._id}</Td>
                        <Td width={"100%"}>{role.roleName}</Td>
                        <Td>
                          <HStack>
                            <Tooltip label="Delete role..." fontSize="sm">
                              <ComponentWithForwardRef>
                                <IconButton
                                  onClick={() => openDialog(role._id)}
                                  isDisabled={role.roleName === "users" || role.roleName === "admins"}
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
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box width={"100%"}>
                <Paginator
                  pageSize={RolesData.limit}
                  totalPages={RolesData.pages}
                  currentPage={RolesData.page}
                  nextPageMethod={NextPage}
                  prevPageMethod={PrevPage}
                  totalItems={RolesData.total}
                  pageSizeMethod={ChangePageSize}
                />
              </Box>

              <MAlertDialog
                dialogType="danger"
                isOpen={isOpen}
                onClose={onClose}
                onAction={() => DeleteRole(selRoleId)}
                headerText="Delete Role?"
                bodyText={{ __html: "Do you really want to delete this role? You can't undo this action afterwards." }}
                cancelButtonText="Cancel"
                actionButtonText="Yes, delete the role!"
                isButtonLoading={isMAlertLoading}
                isButtonLoadingText="deleting role.."
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

export default Roles;
