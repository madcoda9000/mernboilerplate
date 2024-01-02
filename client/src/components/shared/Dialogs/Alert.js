import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

/**
 * @description Alert dialog component
 * @param {string} dialogType - can be 'danger', 'info', 'success' or null
 * @param {Boolean} isOpen - defines wether the dialog is visible or not
 * @param {object} onClose - method to call when cancel or close cross is clicked
 * @param {object} onAction - method to call when action button is clicked
 * @param {string} headerText - the text for the dialog header
 * @param {string} bodyText - the text for the dialog body
 * @param {string} cancelButtonText - the text for the cancel button
 * @param {string} actionButtonText - the text for the action button
 * @param {boolean} isButtonLoading - wether the action button shows a loading state or not
 * @param {string} isButtonLoadinText - the text shown when the action button is in loading state
 * @param {boolean} useActionButton - wether to show a action button. Default true.
 * @returns
 */
const MAlertDialog = (props) => {
  const cancelRef = React.useRef();
  const showActionButton = props.useActionButton !== null && props.useActionButton === false ? false : true;
  let alertType = null;
  if (props.dialogType && props.dialogType === "danger") {
    alertType = "red.500";
  } else if (props.dialogType && props.dialogType === "info") {
    alertType = "blue.500";
  } else if (props.dialogType && props.dialogType === "success") {
    alertType = "green.500";
  }

  return (
    <>
      <AlertDialog
        motionPreset="slideInTop"
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            {alertType ? (
              <AlertDialogHeader fontSize="lg" fontWeight="bold" backgroundColor={alertType} color={"white"}>
                {props.headerText}
              </AlertDialogHeader>
            ) : (
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {props.headerText}
              </AlertDialogHeader>
            )}

            <AlertDialogBody>
              <div dangerouslySetInnerHTML={props.bodyText}></div>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={props.onClose} colorScheme="gray">
                {props.cancelButtonText}
              </Button>
              {showActionButton === true && (
                <Button
                  colorScheme="red"
                  onClick={props.onAction}
                  ml={3}
                  isLoading={props.isButtonLoading}
                  loadingText={props.isButtonLoadingText}
                  variant="solid"
                >
                  {props.actionButtonText}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default MAlertDialog;
