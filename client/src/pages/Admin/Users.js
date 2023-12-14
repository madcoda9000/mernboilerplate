import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import RoleChecker from "../../components/shared/Auth/RoleChecker";
import RoleBadges from "../../components/shared/UI/RoleBadges";
import ComponentWithForwardRef from "../../components/shared/UI/ComponentWithForwardRef";
import { useEffect, useState } from "react";
import UsersService from "../../Services/UsersService";
import Paginator from "../../components/shared/UI/Paginator";
import { useSearchDebounce } from '../../components/shared/Utils';
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
} from '@chakra-ui/react';
import { MdOutlinePeople, MdEdit, MdDelete, MdOutlineSearch, MdCheckCircle, MdDoDisturbOn, MdMail, MdMailLock, MdOutlinePerson } from "react-icons/md";
import AuthContext from "../../components/shared/Auth/AuthContext";
import {makeAuditEntry} from "../../components/shared/Utils";

const Users = () => {

    const [usersData, setUsersData] = useState(null);
    const [isLoading, SetIsLoading] = useState(true);
    const [errMsg, SetErrMsg] = useState(null);
    const [selectedPageSize, setSelectedPageSize] = useState(10);
    const [selectedPage, setSelectedPage] = useState(1);
    const [isLargerThan500] = useMediaQuery('(min-width: 500px)');
    const [search, setSearch] = useSearchDebounce();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isMAlertLoading, SetIsMAlertLoading] = useState(false);
    const navigate = useNavigate();
    const [selUserId, setSelUserId] = useState();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        SetIsLoading(true);
        makeAuditEntry(user.userName, 'info', 'viewed all users listing');   
        var pSize = 100;
        var searchStr = '';
        if (search === null || search.trim() === "" || search.trim().length === 0) { pSize = 10; } else {searchStr=search}
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
        UsersService.getUsersPaginated(page, pageSize, '').then((response) => {
            if (!response.error) {
                setUsersData(response.data.paginatedResult);
                SetIsLoading(false);
                setSelectedPage(response.data.paginatedResult.page);
            } else {
                SetErrMsg(response.data.message);
                SetIsLoading(false);
            }
        });
    }

    const EditUser = (id) => {
        navigate('/Admin/UsersEdit/' + id);
    }

    const PrevPage = () => {
        var np = selectedPage;
        np--;
        LoadData(np, selectedPageSize);
    }

    const NextPage = () => {
        var np = selectedPage;
        np++;
        LoadData(np, selectedPageSize);
    }

    const ChangePageSize = (pageSize) => {
        setSelectedPageSize(pageSize);
        LoadData(1, pageSize);
    }

    const openDialog = (id) => {
        setSelUserId(id);
        onOpen();
    }

    const DeleteUser = (id) => {
        SetIsMAlertLoading(true);
        let paylod = {
            _id: id
        }
        UsersService.deleteUser(paylod).then((response) => {
            if(!response.error) {
                makeAuditEntry(user.userName, 'warn', 'deleted user ' + id);
                onClose();
                LoadData(1,10);
            } else {
                SetErrMsg(response.message);
            }
        });
        SetIsMAlertLoading(false);
        onClose();
    }

    

    return (
        <>
            {isLoading && !usersData ?
                (
                    <>
                        <RoleChecker requiredRole="admins" />
                        <Center width={'100%'} mt={40}>
                            <CircularProgress isIndeterminate color='blue.500' />
                        </Center>
                    </>
                )
                :
                (
                    <>
                        {isLargerThan500 ?
                            (
                                <>
                                    <RoleChecker requiredRole="admins" />
                                    {errMsg &&
                                        <Alert status='error' variant={'solid'}>
                                            <AlertIcon />
                                            {errMsg}
                                        </Alert>
                                    }
                                    <HStack>
                                        <Box>

                                        </Box>
                                        <Flex width={'100%'}>
                                            <HStack>
                                                <Icon as={MdOutlinePerson} display={'inline'} mr={'10px'} w={10} h={10} />
                                                <Heading fontSize={'2xl'} display={'inline'}  >Manage Users...</Heading>
                                            </HStack>
                                            <Spacer />
                                            <HStack>
                                                <InputGroup borderRadius={5} size="sm">
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<MdOutlineSearch color="gray.600" />}
                                                    />
                                                    <Input type="text" placeholder={search ? search : 'search...'} onChange={(e) => setSearch(e.target.value)} />
                                                    <InputRightAddon
                                                        p={0}
                                                        border="none"
                                                    >
                                                        <Button size="sm" borderLeftRadius={0} borderRightRadius={0} type="button" colorScheme={'blue'} variant={'solid'} onClick={() => setSearch('')} >
                                                            {search ? 'reset' : 'search'}
                                                        </Button>
                                                        <Button size="sm" borderLeftRadius={0} borderLeft={'1px solid var(--chakra-colors-gray-300)'} type="button" colorScheme={'whatsapp'} variant={'solid'} onClick={() => navigate('/Admin/UserNew')}  >
                                                            create new User
                                                        </Button>
                                                    </InputRightAddon>
                                                </InputGroup>
                                            </HStack>
                                        </Flex>
                                    </HStack>
                                    <TableContainer mb={'30px'} mt={'30px'}>
                                        <Table variant='striped' colorScheme='gray'>
                                            <Thead>
                                                <Tr>
                                                    <Th>Acc</Th>
                                                    <Th>Mail</Th>
                                                    <Th>Username</Th>
                                                    <Th>Roles</Th>
                                                    <Th>Actions</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {usersData.docs.map((user, i) => (
                                                    <Tr key={i}>
                                                        <Td width={'30px'}>
                                                            {user.accountLocked ?
                                                                (
                                                                    <Tooltip label='Account locked!' fontSize='sm'>
                                                                        <ComponentWithForwardRef>
                                                                            <Icon as={MdDoDisturbOn} color='red.500' />
                                                                        </ComponentWithForwardRef>
                                                                    </Tooltip>
                                                                )
                                                                :
                                                                (
                                                                    <Tooltip label='Account active!' fontSize='sm'>
                                                                        <ComponentWithForwardRef>
                                                                            <Icon as={MdCheckCircle} color='green.500' />
                                                                        </ComponentWithForwardRef>
                                                                    </Tooltip>
                                                                )
                                                            }
                                                        </Td>
                                                        <Td width={'30px'}>
                                                            {user.emailVerified ?
                                                                (
                                                                    <Tooltip label='Email address verified!' fontSize='sm'>
                                                                        <ComponentWithForwardRef>
                                                                            <Icon as={MdMail} color='green.500' />
                                                                        </ComponentWithForwardRef>
                                                                    </Tooltip>
                                                                )
                                                                :
                                                                (
                                                                    <Tooltip label='Email address unverified!' fontSize='sm'>
                                                                        <ComponentWithForwardRef>
                                                                            <Icon as={MdMailLock} color='red.500' />
                                                                        </ComponentWithForwardRef>
                                                                    </Tooltip>
                                                                )
                                                            }
                                                        </Td>
                                                        <Td width={'200px'}>{user.userName}</Td>
                                                        <Td width={'100%'}>{RoleBadges(user.roles)}</Td>
                                                        <Td>
                                                            <HStack>
                                                                <Tooltip label='Edit user...' fontSize='sm'>
                                                                    <ComponentWithForwardRef>
                                                                        <IconButton onClick={() => EditUser(user._id)} mr={'5px'} size={'xs'} aria-label='Edit user...' icon={<MdEdit />} backgroundColor={'yellow.500'} color={'white'} isRound={true} variant='solid' colorScheme="yellow" />
                                                                    </ComponentWithForwardRef>
                                                                </Tooltip>
                                                                {user.userName==="super.admin" ?
                                                                (
                                                                    <Tooltip label='Delete user...' fontSize='sm'>
                                                                        <ComponentWithForwardRef>
                                                                        <IconButton  isDisabled={user.userName==='super.admin'} size={'xs'} aria-label='Delete user...' icon={<MdDelete />} backgroundColor={'red.500'} color={'white'} isRound={true} variant='solid' colorScheme="red" />
                                                                        </ComponentWithForwardRef>
                                                                    </Tooltip>
                                                                )
                                                                :
                                                                (
                                                                    <Tooltip label='Delete user...' fontSize='sm'>
                                                                        <ComponentWithForwardRef>
                                                                            <IconButton  onClick={() => openDialog(user._id)} size={'xs'} aria-label='Delete user...' icon={<MdDelete />} backgroundColor={'red.500'} color={'white'} isRound={true} variant='solid' colorScheme="red" />
                                                                        </ComponentWithForwardRef>
                                                                    </Tooltip>
                                                                )
                                                                }                                                                
                                                            </HStack>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                    <Box width={'100%'}>
                                        <Paginator pageSize={usersData.limit} totalPages={usersData.pages} currentPage={usersData.page} nextPageMethod={NextPage} prevPageMethod={PrevPage} totalItems={usersData.total} pageSizeMethod={ChangePageSize} />
                                    </Box>

                                    <MAlertDialog
                                        dialogType='danger'
                                        isOpen={isOpen}
                                        onClose={onClose}
                                        onAction={() => DeleteUser(selUserId)}
                                        headerText='Delete User?'
                                        bodyText={{__html: "Do you really want to delete this user? You can't undo this action afterwards."}}
                                        cancelButtonText="Cancel"
                                        actionButtonText="Yes, delete the user!"
                                        isButtonLoading={isMAlertLoading}
                                        isButtonLoadingText="deleting user.."
                                    />
                                </>
                            )
                            :
                            (
                                <>
                                    <HStack>
                                        <Icon as={MdOutlinePeople} color={'blue.500'} display={'inline'} mr={'10px'} w={10} h={10} />
                                        <Heading fontSize={'2xl'} display={'inline'} >Manage Users...</Heading>
                                    </HStack>
                                </>
                            )
                        }
                    </>
                )
            }
        </>
    )

}

export default Users;