import React, { useContext } from "react";
import RoleChecker from "../../components/shared/Auth/RoleChecker";
import { useEffect, useState } from "react";
import LogsService from "../../Services/LogsService";
import Paginator from "../../components/shared/UI/Paginator";
import * as moment from 'moment';
import { useSearchDebounce } from '../../components/shared/Utils';
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
    AlertIcon,
    Box,
    CircularProgress,
    Center,
    Heading,
    useMediaQuery,
    HStack,
    Button,
    Flex,
    Spacer,
    InputLeftElement,
    InputRightAddon,
    InputGroup,
    Input,
    CloseButton,
    useDisclosure,
    Link,
} from '@chakra-ui/react';
import { MdArrowBack, MdArrowForward, MdError, MdInfo, MdOutlineListAlt, MdOutlineSearch, MdOutlineWarning } from "react-icons/md";
import AuthContext from "../../components/shared/Auth/AuthContext";
import {makeAuditEntry} from "../../components/shared/Utils";
import MAlertDialog from "../../components/shared/Dialogs/Alert";

const RequestLogs = () => {

    const [LogData, setLogData] = useState(null);
    const [isLoading, SetIsLoading] = useState(true);
    const [errMsg, SetErrMsg] = useState(null);
    const [selectedPageSize, setSelectedPageSize] = useState(10);
    const [selectedPage, setSelectedPage] = useState(1);
    const [isLargerThan500] = useMediaQuery('(min-width: 500px)');
    const [search, setSearch] = useSearchDebounce();
    const {user} = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currDialogBody, setCurrDialogBody] = useState();

    useEffect(() => {
        SetIsLoading(true);
        makeAuditEntry(user.userName, 'info', 'viewed Request logs');
        var pSize = 100;
        var searchStr;
        if (search === null || search.trim() === "" || search.trim().length === 0) { pSize = 10; searchStr = ''; } else { searchStr = search; }
        if(search) {
            makeAuditEntry(user.userName, 'info', 'searched Request logs for ' + search);
        }
        LogsService.getRequestLogs(1, pSize, searchStr).then((response) => {
            if (!response.error) {
                setLogData(response.data.paginatedResult);
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
        LogsService.getRequestLogs(page, pageSize, '').then((response) => {
            if (!response.error) {
                setLogData(response.data.paginatedResult);
                SetIsLoading(false);
                setSelectedPage(response.data.paginatedResult.page);
            } else {
                SetErrMsg(response.data.message);
                SetIsLoading(false);
            }
        });
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

    const openDialog = (log) => {
        let entries = log.message.split('|');
        var typ = entries[0]==='REQ ' ? 'Request' : 'Response';
        let bd = '<ul class=\'requestList\'>';
        bd += '<li><b>Type:</b> ' + typ + '</li>';
        bd += '<li><b>Id:</b> ' + entries[1] + '</li>';
        bd += '<li><b>Method / Status:</b> ' + entries[2] + '</li>';
        bd += '<li><b>Path:</b> ' + entries[3] + '</li>'; 
        console.log(entries);       
        if(entries.length === 5) {
            bd += '<li><b>Host:</b> ' + entries[4] + '</li>';
        } else if(entries.length === 6) {
            bd += '<li><b>Message:</b> ' + entries[4] + '</li>';
            bd += '<li><b>Host:</b> ' + entries[5] + '</li>';
        }
        
        bd += '</ul>';
        setCurrDialogBody({ __html: bd });
        onOpen();
        makeAuditEntry(user.userName, 'info', 'viewed Request log details for ' + log._id);
    }

    return (
        <>
            {isLoading && !LogData ?
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
                                    <HStack>
                                        <Flex width={'100%'}>
                                            <HStack>
                                                <Icon as={MdOutlineListAlt} display={'inline'} mr={'10px'} w={10} h={10} />
                                                <Heading fontSize={'2xl'} display={'inline'}  >View Request Logs...</Heading>
                                            </HStack>
                                            <Spacer />
                                            <HStack>
                                                <InputGroup borderRadius={5} size="sm">
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<MdOutlineSearch color="gray.600" />}
                                                    />
                                                    <Input type="text" placeholder={'search...'} onChange={(e) => setSearch(e.target.value)} />
                                                    <InputRightAddon
                                                        p={0}
                                                        border="none"
                                                    >
                                                        <Button size="sm" borderLeftRadius={0} borderRightRadius={0} type="button" colorScheme={'blue'} variant={'solid'} onClick={() => setSearch('')} >
                                                            {search ? 'reset' : 'search'}
                                                        </Button>
                                                    </InputRightAddon>
                                                </InputGroup>
                                            </HStack>
                                        </Flex>
                                    </HStack>
                                    {errMsg &&
                                        <Alert status='error' variant={'solid'} mt={7}>
                                            <AlertIcon />
                                            <Box>
                                                {errMsg}
                                            </Box>
                                            <CloseButton
                                                alignSelf='flex-end'
                                                position='absolute'
                                                right={2}
                                                top={2}
                                                onClick={() => SetErrMsg(null)}
                                            />
                                        </Alert>
                                    }
                                    <TableContainer mb={'30px'} mt={'30px'}>
                                        <Table variant='striped' colorScheme='gray'>
                                            <Thead>
                                                <Tr>
                                                    <Th>Time</Th>
                                                    <Th>Level</Th>
                                                    <Th>Message</Th>
                                                    <Th>Details</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {LogData.docs.map((log, i) => (
                                                    <Tr key={i}>
                                                        <Td width={'200px'}>{moment(new Date(log.timestamp)).format('DD.MM.YYYY HH:mm:ss sss')}</Td>
                                                        <Td>
                                                            {log.level==='http' && log.message.startsWith('REQ') ? (
                                                                <MdArrowForward color="var(--chakra-colors-blue-500)" size={20} title="incoming Request" />
                                                            )
                                                            :
                                                            (
                                                                <MdArrowBack color="var(--chakra-colors-yellow-500)" size={20} title="outgiong response"/>
                                                            )
                                                            }
                                                        </Td>
                                                        <Td width={'100%'}>{log.message}</Td>
                                                        <Td><MdInfo cursor={'pointer'} onClick={() => openDialog(log)} color="var(--chakra-colors-blue-500)" size={20} title="view details..." /></Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                    <Box width={'100%'}>
                                        <Paginator pageSize={LogData.limit} totalPages={LogData.pages} currentPage={LogData.page} nextPageMethod={NextPage} prevPageMethod={PrevPage} totalItems={LogData.total} pageSizeMethod={ChangePageSize} />
                                    </Box>

                                    <MAlertDialog
                                        dialogType='info'
                                        isOpen={isOpen}
                                        onClose={onClose}
                                        useActionButton={false}
                                        headerText='Request / Response Details'
                                        bodyText={currDialogBody}
                                        cancelButtonText="Close"
                                    />
                                </>
                            )
                            :
                            (
                                <>
                                    <HStack>
                                        <Icon as={MdOutlineListAlt} color={'blue.500'} display={'inline'} mr={'10px'} w={10} h={10} />
                                        <Heading fontSize={'2xl'} display={'inline'} >View Request Logs...</Heading>
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

export default RequestLogs;