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
} from '@chakra-ui/react';
import { MdError, MdInfo, MdOutlineListAlt, MdOutlineSearch, MdOutlineWarning } from "react-icons/md";
import AuthContext from "../../components/shared/Auth/AuthContext";
import {makeAuditEntry} from "../../components/shared/Utils";

const AuditLogs = () => {

    const [LogData, setLogData] = useState(null);
    const [isLoading, SetIsLoading] = useState(true);
    const [errMsg, SetErrMsg] = useState(null);
    const [selectedPageSize, setSelectedPageSize] = useState(10);
    const [selectedPage, setSelectedPage] = useState(1);
    const [isLargerThan500] = useMediaQuery('(min-width: 500px)');
    const [search, setSearch] = useSearchDebounce();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        SetIsLoading(true);
        makeAuditEntry(user.userName, 'info', 'viewed Audit logs');
        var pSize = 100;
        var searchStr;
        if (search === null || search.trim() === "" || search.trim().length === 0) { pSize = 10; searchStr = ''; } else { searchStr = search; }
        if(search) {
            makeAuditEntry(user.userName, 'warn', 'searched audit logs for ' + search);
        }
        LogsService.getAuditLogs(1, pSize, searchStr).then((response) => {
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
        LogsService.getAuditLogs(page, pageSize, '').then((response) => {
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
                                                <Heading fontSize={'2xl'} display={'inline'}  >View Audit Logs...</Heading>
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
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {LogData.docs.map((log, i) => (
                                                    <Tr key={i}>
                                                        <Td width={'200px'}>{moment(new Date(log.timestamp)).format('DD.MM.YYYY HH:mm:ss')}</Td>
                                                        <Td>
                                                            {log.level==='info' &&
                                                                <MdInfo color="var(--chakra-colors-blue-500)" size={20} title="Informational log entry" />
                                                            }
                                                            {log.level==='warn' &&
                                                                <MdOutlineWarning color="var(--chakra-colors-yellow-500)" size={20} title="Warning log entry" />
                                                            }
                                                            {log.level==='error' &&
                                                                <MdError color="var(--chakra-colors-red-500)" size={20} title="Error log entry"/>
                                                            }
                                                        </Td>
                                                        <Td width={'100%'}>{log.message}</Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                    <Box width={'100%'}>
                                        <Paginator pageSize={LogData.limit} totalPages={LogData.pages} currentPage={LogData.page} nextPageMethod={NextPage} prevPageMethod={PrevPage} totalItems={LogData.total} pageSizeMethod={ChangePageSize} />
                                    </Box>
                                </>
                            )
                            :
                            (
                                <>
                                    <HStack>
                                        <Icon as={MdOutlineListAlt} color={'blue.500'} display={'inline'} mr={'10px'} w={10} h={10} />
                                        <Heading fontSize={'2xl'} display={'inline'} >View Audit Logs...</Heading>
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

export default AuditLogs;