import { useState, useCallback } from "react";

/**
 * useClipboard - copy text to clipboard with status
 *
 * Usage:
 * const [isCopied, copy] = useClipboard();
 * copy("Hello world");
 */
export function useClipboard(timeout = 1500) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn("Clipboard API not supported");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, timeout);

        return true;
      } catch (err) {
        console.error("Failed to copy: ", err);
        setIsCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return [isCopied, copy];
}

// Example usage:
// const [copied, copy] = useClipboard();
// <button onClick={() => copy("Hello!")}>{copied ? "Copied!" : "Copy"}</button>
export default useClipboard;
