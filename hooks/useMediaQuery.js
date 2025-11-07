import { useState, useEffect } from "react";

/**
 * useMediaQuery - Track whether a CSS media query matches
 *
 * Usage:
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * return <div>{isMobile ? 'Mobile View' : 'Desktop View'}</div>;
 *
 * @param {string} query - CSS media query string
 * @returns {boolean} - true if query matches, false otherwise
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false; // default for SSR
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);

    mediaQueryList.addEventListener("change", listener);
    setMatches(mediaQueryList.matches); // sync initial value

    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// Example usage:
// const isDesktop = useMediaQuery('(min-width: 1024px)');
// return <p>{isDesktop ? 'Desktop layout' : 'Mobile layout'}</p>;
export default useMediaQuery;