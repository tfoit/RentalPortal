import React, { useState, useEffect } from "react";

/**
 * ThemeToggle component for switching between light and dark mode
 * Uses natural earthy color palette with sage green as primary
 */
const ThemeToggle = () => {
  // Check if user has dark mode preference or has previously set a theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      return savedTheme === "dark" || (!savedTheme && prefersDark);
    }
    return false;
  });

  // Update the DOM when the theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleTheme} className="relative inline-flex items-center justify-center p-1 w-14 h-7 rounded-full bg-[#F5F2E9] dark:bg-[#3A5145] transition-colors duration-normal shadow-inner" aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <span className="sr-only">{isDarkMode ? "Switch to light mode" : "Switch to dark mode"}</span>

      {/* Track */}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span className={`absolute inset-0 transform ${isDarkMode ? "translate-x-0" : "translate-x-full"} transition-transform duration-normal`}>
          {/* Sun and moon icons */}
          <span className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? "opacity-100" : "opacity-0"} transition-opacity duration-normal`}>
            <svg className="w-5 h-5 text-[#D8CCAD]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </span>
          <span className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? "opacity-0" : "opacity-100"} transition-opacity duration-normal`}>
            <svg className="w-5 h-5 text-[#4D6A59]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
        </span>
      </span>

      {/* Thumb/Knob */}
      <span className={`relative z-10 block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-normal ease-spring ${isDarkMode ? "translate-x-3.5" : "-translate-x-3.5"}`} />
    </button>
  );
};

export default ThemeToggle;
