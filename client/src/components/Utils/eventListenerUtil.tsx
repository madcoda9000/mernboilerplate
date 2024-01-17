type EventListener = (event: Event) => void

const eventTypes = ["keypress", "mousemove", "mousedown", "scroll", "touchmove", "pointermove"]
export const addEventListeners = (listener: EventListener) => {
  eventTypes.forEach((type) => {
    window.addEventListener(type, listener, false)
  })
}
export const removeEventListeners = (listener: EventListener) => {
  if (listener) {
    eventTypes.forEach((type) => {
      window.removeEventListener(type, listener, false)
    })
  }
}
