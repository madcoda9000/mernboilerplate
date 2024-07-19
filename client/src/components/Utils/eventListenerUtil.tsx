type EventListener = (event: Event) => void

/**
 * Adds event listeners to the window object for the specified event types.
 *
 * @param {EventListener} listener - The event listener function to be added.
 * @return {void} This function does not return anything.
 */
const eventTypes = ["keypress", "mousemove", "mousedown", "scroll", "touchmove", "pointermove"]
export const addEventListeners = (listener: EventListener) => {
  eventTypes.forEach((type) => {
    window.addEventListener(type, listener, false)
  })
}

/**
 * Removes event listeners from the window object for the specified event types.
 *
 * @param {EventListener} listener - The event listener function to be removed.
 * @return {void} This function does not return anything.
 */
export const removeEventListeners = (listener: EventListener) => {
  if (listener) {
    eventTypes.forEach((type) => {
      window.removeEventListener(type, listener, false)
    })
  }
}
