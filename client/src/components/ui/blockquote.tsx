import React from "react"
import { cn } from "@/lib/utils"

type BlockquoteProps = {
  children?: React.ReactNode
  className?: string
}

/**
 * A functional component that renders a styled blockquote element.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} [props.children] - The content to be displayed inside the blockquote.
 * @param {string} [props.className] - Additional class names to apply to the blockquote.
 * @returns {JSX.Element} The rendered blockquote component.
 */
const Blockquote = ({ children, className }: BlockquoteProps) => {
  return (
    <div
      className={cn(
        "relative rounded-lg border-l-8 border-l-white-700 dark:border-l-white-500  dark:bg-black py-5 pl-16 pr-5 font-sans text-lg italic leading-relaxed text-gray-200 dark:text-white before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-200 before:content-['“']",
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * A functional component that renders the author of a blockquote.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} [props.children] - The content to be displayed as the author.
 * @param {string} [props.className] - Additional class names to apply to the author text.
 * @returns {JSX.Element} The rendered blockquote author component.
 */
const BlockquoteAuthor = ({ children, className }: BlockquoteProps) => {
  return (
    <p className={cn("mt-5 pr-4 text-right font-bold not-italic text-gray-200", className)}>
      {children}
    </p>
  )
}

export { Blockquote, BlockquoteAuthor }
