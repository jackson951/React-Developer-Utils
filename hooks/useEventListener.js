import { useEffect, useRef } from "react";

/**
 * useEventListener - Add event listeners in React safely
 *
 * Usage:
 * const handler = (e) => console.log(e.key);
 * useEventListener('keydown', handler, window);
 *
 * @param {string} eventName - Event type, e.g., 'click', 'keydown'
 * @param {Function} handler - Callback function
 * @param {HTMLElement|Window|Document} element - Target element (default: window)
 */
export function useEventListener(eventName, handler, element = window) {
  // Use ref to avoid re-adding listener on every render
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element || !element.addEventListener) return;

    const eventListener = (event) => savedHandler.current(event);

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

// Example usage:
// useEventListener('resize', () => {
//   console.log(window.innerWidth);
// });
export default useEventListener;