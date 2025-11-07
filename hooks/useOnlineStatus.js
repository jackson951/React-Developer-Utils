import { useState, useEffect } from "react";

/**
 * useOnlineStatus - Detect if the user is online or offline
 *
 * Usage:
 * const isOnline = useOnlineStatus();
 * return <div>{isOnline ? 'Online' : 'Offline'}</div>;
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

// Example usage:
// const isOnline = useOnlineStatus();
// <span>{isOnline ? '🟢 Online' : '🔴 Offline'}</span>
export default useOnlineStatus;
