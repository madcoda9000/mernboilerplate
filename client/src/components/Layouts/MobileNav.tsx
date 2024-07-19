import MenuEntries from "@/components/Layouts/MenuEntries"
import { useNavigate } from "react-router-dom"
import { Icons } from "../Icons"
import { SheetClose } from "@/components/ui/sheet"

/**
 * Renders the mobile navigation menu with main menu, settings, and logs.
 *
 * @return {JSX.Element} The JSX elements for the mobile navigation menu.
 */
const MobileNav = () => {
  const nav = useNavigate()
  return (
    <>
      <div className="text-lg font-semibold">Main Menu</div>
      <div>
        <div>
          <div className="ml-3 mt-2">
            <SheetClose asChild>
              <span onClick={() => nav("/Home")} title={"Overview"} className="cursor-pointer">
                Overview
              </span>
            </SheetClose>
            <Icons.arrowRight className="inline ml-2" />
          </div>
        </div>

        <div className="text-lg font-semibold">Settings</div>
        {MenuEntries.settingsItems.map((component, index) => (
          <div key={index}>
            <div className="ml-3 mt-2">
              <SheetClose asChild>
                <span
                  onClick={() => nav(component.href)}
                  title={component.description}
                  className="cursor-pointer"
                >
                  {component.title}
                </span>
              </SheetClose>
              <Icons.arrowRight className="inline ml-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="text-lg font-semibold mt-3">Logs</div>
      <div>
        {MenuEntries.logsItems.map((component, index) => (
          <div className="ml-3 mt-2" key={index}>
            <SheetClose asChild>
              <span
                onClick={() => nav(component.href)}
                title={component.description}
                className="cursor-pointer"
              >
                {component.title}
              </span>
            </SheetClose>
            <Icons.arrowRight className="inline ml-2" />
          </div>
        ))}
      </div>
    </>
  )
}
export default MobileNav
