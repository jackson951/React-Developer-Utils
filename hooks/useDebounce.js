import { useState, useEffect } from "react";

/**
 * useDebounce - Debounces a value over a given delay
 *
 * Usage:
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if value or delay changes or on unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Example usage:
// const [query, setQuery] = useState("");
// const debouncedQuery = useDebounce(query, 500);
// useEffect(() => { fetchData(debouncedQuery); }, [debouncedQuery]);
export default useDebounce;
