import { useState, useEffect } from "react";

/**
 * useTheme - Simple light/dark theme hook
 *
 * Usage:
 * const [theme, toggleTheme] = useTheme();
 * <button onClick={toggleTheme}>Switch to {theme === 'light' ? 'dark' : 'light'} mode</button>
 *
 * Returns: [currentTheme, toggleTheme]
 * currentTheme: 'light' | 'dark'
 * toggleTheme: () => void
 */
export function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return [theme, toggleTheme];
}

export default useTheme;
