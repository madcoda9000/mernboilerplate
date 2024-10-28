import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { FC } from "react"
import { Icons } from "../Icons"
import { useMediaQuery } from "../hooks/useMediaQuery"

interface TimeoutWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

/**
 * A modal component that warns the user about session timeout due to inactivity.
 *
 * The component adapts its layout based on screen size. On desktop screens, it
 * displays a dialog, while on smaller screens, it uses a drawer.
 *
 * Props:
 * - `isOpen`: A boolean indicating whether the modal is open.
 * - `onClose`: A function to be called when the user chooses to stay logged in.
 * - `onLogout`: A function to be called when the user chooses to log off.
 *
 * The modal presents the user with options to either stay signed in or log off.
 */
const TimeoutWarningModal: FC<TimeoutWarningModalProps> = ({ isOpen, onClose, onLogout }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <>
        <Dialog open={isOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-3">
                <Icons.clock className="inline mr-3" />
                &nbsp;Session Timeout!
              </DialogTitle>
              <DialogDescription>
                You're being timed out due to inactivity. Please choose to stay signed in or to
                logoff. Otherwise, you will be logged off automaticall
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-5 border-t-2">
              <Button variant={"outline"} className="mr-5 mt-3" onClick={onLogout}>
                Log off
              </Button>
              <Button className="mt-3" onClick={onClose}>
                Stay Logged In
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  } else {
    return (
      <Drawer open={isOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Session Timeout!</DrawerTitle>
            <DrawerDescription>
              You're being timed out due to inactivity. Please choose to stay signed in or to
              logoff. Otherwise, you will be logged off automaticall
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <Button variant={"outline"} className="mt-3" onClick={onLogout}>
              Log off
            </Button>
            <Button className="mt-3" onClick={onClose}>
              Stay Logged In
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }
}

export default TimeoutWarningModal
