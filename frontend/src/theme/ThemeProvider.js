import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import createMaterialTheme from "./materialTheme";

// Create a context for theme management
const ThemeContext = createContext();

/**
 * Theme Provider Component
 *
 * Provides theme functionality throughout the application:
 * - Dark mode toggling
 * - Theme preferences storage
 * - Dynamic theme switching
 * - Material UI theme integration
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 */
export const ThemeProvider = ({ children }) => {
  // Check for user's preferred theme or saved theme
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }

    // Otherwise check for OS preference
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Create Material UI theme based on dark mode state
  const materialTheme = createMaterialTheme(darkMode);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update the HTML class when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Prevent transitions on initial load
  useEffect(() => {
    // Add preload class to prevent transitions on initial load
    document.documentElement.classList.add("preload");

    // Remove preload class after a short delay
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("preload");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Listen for OS theme changes
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // Update state when OS preference changes
      const handleChange = (e) => {
        setDarkMode(e.matches);
      };

      // Add listener
      mediaQuery.addEventListener("change", handleChange);

      // Cleanup
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, []);

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={materialTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme
 * @returns {Object} Theme context with darkMode state and toggleDarkMode function
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
