import {
    Flex,
    Stack,
    Image,
    useMediaQuery,
  } from '@chakra-ui/react';
import DarkModeSwitcher from "../../components/shared/UI/DarkModeSwitcher";
import { Outlet } from 'react-router-dom';

const AuthLayout = ({ children }) => {
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    return (
        <>
        <div className="authBody">
            <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
                <Flex p={8} flex={1} align={'top'} justify={'center'}>
                    <Stack spacing={4} w={'full'} maxW={'md'}>
                        <Outlet></Outlet>
                        <Stack height={'100%'} alignContent={'center'} align={'center'}>                            
                            <DarkModeSwitcher showSwitch={true} position={'absolute'}/>                        
                        </Stack>
                    </Stack>    
                </Flex>
                {isMobile ?
                    (
                        <></>
                    )
                    :
                    (
                        <Flex flex={1}>
                            <Image
                            alt={'Login Image'}
                            objectFit={'cover'}
                            src={
                                'images/bg.jpg'
                            }
                            />
                        </Flex>
                    )                
                }                                
            </Stack>        
        </div>
        </>
    )
}
export default AuthLayout; 