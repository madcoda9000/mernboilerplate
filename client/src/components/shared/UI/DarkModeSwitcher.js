import { Switch, useColorMode, Icon } from '@chakra-ui/react';
import { MdBrightness2, MdBrightness5 } from "react-icons/md";
import { useEffect } from 'react';

/**
 * @description react component to render a toggle switch. Pass showSwitch={false} as property to dispable switch.
 * @exports DarkModeSwitcher
 * @param {bool} showSwitch Wether to show the switch or not. Possible values: true or false
 * @param {string} position How to position the switch? Possible values: absolute, static and relative
 * @returns a switch to toggle dark mode. 
 */
const DarkModeSwitcher = ({showSwitch, position}) => {
    const { colorMode, toggleColorMode } = useColorMode();

    /**
     * @description method to switch color mode and store the current mode to localstorage
     */
    const setDarkMode = () => {
        if(colorMode==='light') {
            toggleColorMode();
        } else if(colorMode==='dark') {
            toggleColorMode();
        }
    };

    /**
     * @description useEffect hook to set color mode on component mount once
     */
    useEffect(() => {
        const cMode = localStorage.getItem('chakra-ui-color-mode');
        if(cMode) {
            if(cMode==='light' && colorMode==='dark') {toggleColorMode();}
            if(cMode==='dark' && colorMode==='light') {toggleColorMode();}
        }
    }, [colorMode, toggleColorMode]);

    if(showSwitch === true) {
        return (
            <Switch position={position} bottom={'10'} colorScheme='blue' id="dmSwDarkMode" onChange={setDarkMode} isChecked={colorMode==='light' ? false : true}>
                {colorMode === 'light' ? <Icon color="blue.600" as={MdBrightness5} /> : <Icon as={MdBrightness2} />}
            </Switch>
        )
    } else if(showSwitch === false) {
        return (
            <></>
        )
    }
}
export default DarkModeSwitcher