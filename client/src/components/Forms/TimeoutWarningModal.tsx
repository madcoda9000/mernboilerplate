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
