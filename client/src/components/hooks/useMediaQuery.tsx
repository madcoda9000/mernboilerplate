import * as React from "react"

/**
 * Custom React hook that listens to a media query and returns whether the query matches.
 *
 * @param {string} query - The media query string to match.
 * @return {boolean} The current state of whether the media query matches.
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}
