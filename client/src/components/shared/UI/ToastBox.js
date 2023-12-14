import { Box, CloseButton, Text } from "@chakra-ui/react";

/**
 * @description component to render a toast box
 * @param {string} alertBgColor the css class for the background color. For ex. red.500
 * @param {string} alertTextColor  the css class for the background color. For ex. white
 * @param {string} alertMessage the message to display in the toast
 * @param {object} onClose the mothod to call as close action
 * @returns 
 */
const ToastBox = ({ alertBgColor, alertTextColor, alertMessage, onClose }) => {
    return (
        <>
            <Box color={alertTextColor} pl={3} pr={10} pt={3} pb={3} bg={alertBgColor}>
                <Text>{alertMessage}</Text>
                <CloseButton
                    color={'white'}
                    alignSelf='flex-end'
                    position='absolute'
                    right={2}
                    top={4}
                    onClick={onClose}
                />
            </Box>
        </>
    )
}
export default ToastBox;