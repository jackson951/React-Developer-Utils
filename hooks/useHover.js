import { useState, useRef, useEffect } from "react";

/**
 * useHover - Track hover state for any DOM element
 *
 * Usage:
 * const [hoverRef, isHovered] = useHover();
 * <div ref={hoverRef}>Hover me! {isHovered && '😎'}</div>
 */
export function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return [ref, isHovered];
}

// Example usage:
// const [hoverRef, isHovered] = useHover();
// <button ref={hoverRef}>{isHovered ? "Hovered!" : "Hover me"}</button>
export default useHover;