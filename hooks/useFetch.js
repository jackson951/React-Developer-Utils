import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useFetch - Data fetching hook with abort and retry support
 *
 * Usage:
 * const { data, error, loading, refetch } = useFetch('https://api.example.com/data');
 *
 * @param {string} url - The API endpoint
 * @param {object} options - Fetch options (headers, method, body, etc.)
 * @param {boolean} immediate - If true, fetches immediately (default: true)
 */
export function useFetch(url, options = {}, immediate = true) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const controllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const response = await fetch(url, { ...options, signal });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (immediate) fetchData();

    return () => {
      controllerRef.current?.abort(); // Cancel ongoing request on unmount
    };
  }, [fetchData, immediate]);

  return { data, error, loading, refetch: fetchData };
}

// Example usage:
// const { data, error, loading, refetch } = useFetch('https://api.example.com/users');
// if (loading) return <p>Loading...</p>;
// if (error) return <p>Error: {error.message}</p>;
// return <pre>{JSON.stringify(data, null, 2)}</pre>;
export default useFetch;