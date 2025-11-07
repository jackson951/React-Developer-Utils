import { useEffect } from "react";

/**
 * useOutsideClick - Detect clicks outside a specified element
 *
 * Usage:
 * const ref = useRef();
 * useOutsideClick(ref, () => alert("Clicked outside!"));
 * return <div ref={ref}>Click outside me</div>;
 *
 * @param {React.RefObject} ref - The ref to the element
 * @param {Function} callback - Function to call when click is outside
 */
export function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref, callback]);
}
