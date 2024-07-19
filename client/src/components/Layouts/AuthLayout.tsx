import { AppSettings, Quote } from "@/Interfaces/GlobalInterfaces"
import QuotesService from "@/Services/QuotesService"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Blockquote, BlockquoteAuthor } from "@/components/ui/blockquote"

declare const window: {
  APP_TITLE: string
} & Window
const appTitle = window.APP_TITLE

/**
 * Renders the AuthLayout component.
 *
 * @return {JSX.Element} The rendered AuthLayout component.
 */
export default function AuthLayout() {
  const [aSettings, setAsettings] = useState<AppSettings>()
  const [quote, setQuote] = useState<Quote>()
  const nav = useNavigate()

  useEffect(() => {
    const locSett = localStorage.getItem("AppSettings")
    if (locSett) {
      setAsettings(JSON.parse(locSett))
      if (JSON.parse(locSett).showQuoteOfTheDay === "true") {
        QuotesService.getQuoteOfTheDay().then((response) => {
          if (!response.data.error) {
            setQuote(response.data.quote)
          }
        })
      }
    }
  }, [])

  return (
    <>
      <div className="flex">
        <div className="flex-1 h-[100vh] flex-col dark:text-black dark:bg-primary bg-primary text-white lg:flex dark:border-r hidden lg_block ">
          <div className="relative hidden h-full flex-col p-10 lg:flex dark:border-r">
            <div className="absolute inset-0 " />
            <div
              className="relative z-20 flex items-center text-lg font-medium cursor-pointer"
              onClick={() => nav("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              {appTitle}
            </div>
            {aSettings && aSettings.showQuoteOfTheDay === "true" && (
              <div className="relative z-20 mt-auto">
                <Blockquote>
                  {quote?.quote}
                  <BlockquoteAuthor>{quote?.author}</BlockquoteAuthor>
                </Blockquote>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 dark:bg-background">
          <Outlet />
        </div>
      </div>
    </>
  )
}
