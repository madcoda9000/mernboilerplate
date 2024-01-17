import MenuEntries from "@/components/Layouts/MenuEntries"
import { useNavigate } from "react-router-dom"
import { Icons } from "../Icons"

const MobileNav = () => {
  const nav = useNavigate()
  return (
    <>
      <div className="text-lg font-semibold">Settings</div>
      <div>
        {MenuEntries.settingsItems.map((component) => (
          <div>
            <div className="ml-3 mt-2">
              <span
                onClick={() => nav(component.href)}
                title={component.description}
                className="cursor-pointer"
              >
                {component.title}
              </span>
              <Icons.arrowRight className="inline ml-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="text-lg font-semibold mt-3">Logs</div>
      <div>
        {MenuEntries.logsItems.map((component) => (
          <div className="ml-3 mt-2">
            <span
              onClick={() => nav(component.href)}
              title={component.description}
              className="cursor-pointer"
            >
              {component.title}
            </span>
            <Icons.arrowRight className="inline ml-2" />
          </div>
        ))}
      </div>
    </>
  )
}
export default MobileNav
