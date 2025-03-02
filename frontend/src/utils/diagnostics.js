/**
 * Diagnostics utility for the EuroRentals frontend application
 * Provides tools for diagnosing and troubleshooting issues
 */
import logger from "./logger";
import { createTheme } from "@mui/material/styles";

const diagnostics = {
  /**
   * Check for critical imports and log their status
   * This can help diagnose issues with missing files or import errors
   */
  checkImports: async () => {
    logger.info("Running import diagnostics check");
    const results = {
      success: true,
      failures: [],
      imports: {},
    };

    try {
      // Check theme import
      try {
        logger.info("Checking for theme.js file existence");

        // First try to import directly
        try {
          const theme = await import("../theme.js").catch(async (err) => {
            logger.error("Could not import theme.js directly", { error: err.message });

            // Try to import from themes directory as fallback
            try {
              const fallbackTheme = await import("../themes/theme.js");
              logger.info("Successfully imported theme from themes/theme.js");

              // Copy the fallback theme to the expected location
              if (typeof window !== "undefined") {
                logger.info("Creating theme.js file from themes/theme.js");
                // In a real app, we would write to the filesystem here
                // But in a browser context, we can't write files directly
                logger.warn("Cannot copy theme.js in browser context - please create the file manually");
              }

              return fallbackTheme.default;
            } catch (fbErr) {
              logger.error("Could not import theme from themes/theme.js either", { error: fbErr.message });
              throw new Error("No theme file found in either location");
            }
          });

          results.imports.theme = {
            status: "success",
            path: "../theme",
            exists: true,
          };
          logger.info("Theme import successful");
        } catch (err) {
          results.success = false;
          results.failures.push("theme");
          results.imports.theme = {
            status: "error",
            path: "../theme",
            exists: false,
            error: err.message,
          };
          logger.error("Theme import failed", { error: err.message });
        }
      } catch (err) {
        results.success = false;
        results.failures.push("theme");
        results.imports.theme = {
          status: "error",
          path: "../theme",
          exists: false,
          error: err.message,
        };
        logger.error("Theme import check failed", { error: err.message });
      }

      // Add more import checks as needed for other critical files
    } catch (err) {
      logger.error("Diagnostics import check failed", { error: err.message });
      results.success = false;
      results.error = err.message;
    }

    return results;
  },

  /**
   * Create theme file if missing
   * This is a recovery function to fix missing theme file
   */
  createThemeFileIfMissing: () => {
    logger.info("Attempting to create theme file if missing");

    // We can't write files from the browser, but we can provide the theme object
    // that can be used by the application directly
    const theme = createTheme({
      palette: {
        primary: {
          main: "#2196f3", // Blue
          light: "#64b5f6",
          dark: "#1976d2",
          contrastText: "#fff",
        },
        secondary: {
          main: "#ff9800", // Orange
          light: "#ffb74d",
          dark: "#f57c00",
          contrastText: "#fff",
        },
        error: {
          main: "#f44336",
        },
        background: {
          default: "#f5f5f5",
          paper: "#ffffff",
        },
      },
      typography: {
        fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
        h1: { fontSize: "2.5rem", fontWeight: 500 },
        h2: { fontSize: "2rem", fontWeight: 500 },
        h3: { fontSize: "1.75rem", fontWeight: 500 },
        h4: { fontSize: "1.5rem", fontWeight: 500 },
        h5: { fontSize: "1.25rem", fontWeight: 500 },
        h6: { fontSize: "1rem", fontWeight: 500 },
        button: { textTransform: "none" },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { fontWeight: 500 },
            contained: {
              boxShadow: "none",
              "&:hover": { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.08)",
              overflow: "visible",
            },
          },
        },
      },
    });

    logger.info("Created fallback theme object");
    return theme;
  },

  /**
   * Check browser and environment information
   */
  getEnvironmentInfo: () => {
    const info = {
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        platform: navigator.platform,
        onLine: navigator.onLine,
      },
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation?.type || "unknown",
      },
      performance: {
        memory: window.performance?.memory
          ? {
              jsHeapSizeLimit: Math.round(window.performance.memory.jsHeapSizeLimit / (1024 * 1024)) + "MB",
              totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / (1024 * 1024)) + "MB",
              usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) + "MB",
            }
          : null,
        navigation: window.performance?.navigation
          ? {
              redirectCount: window.performance.navigation.redirectCount,
              type: ["navigate", "reload", "back_forward", "reserved"][window.performance.navigation.type],
            }
          : null,
      },
      environment: {
        mode: import.meta.env.MODE,
        isProduction: import.meta.env.PROD,
        isDevelopment: import.meta.env.DEV,
        buildTime: import.meta.env.VITE_BUILD_TIME || "unknown",
        version: import.meta.env.VITE_APP_VERSION || "development",
      },
    };

    logger.info("Environment diagnostics", info);
    return info;
  },

  /**
   * Checks if localStorage is working properly
   */
  checkLocalStorage: () => {
    try {
      const testKey = "_diagnostics_test_";
      localStorage.setItem(testKey, "test");
      const result = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      const isWorking = result === "test";
      logger.info("LocalStorage check", { isWorking });

      return {
        isWorking,
        error: isWorking ? null : "LocalStorage test failed",
      };
    } catch (err) {
      logger.error("LocalStorage check failed", { error: err.message });
      return {
        isWorking: false,
        error: err.message,
      };
    }
  },

  /**
   * Check i18n language configuration
   * @returns {Object} i18n diagnostic information
   */
  checkI18n: () => {
    const result = { status: "unknown", issues: [] };

    try {
      logger.info("Checking i18n configuration");

      // Check if i18n is available
      if (typeof window.i18n === "undefined" && typeof i18next === "undefined") {
        result.status = "error";
        result.issues.push("i18n library not found");
        return result;
      }

      // Use whichever is available
      const i18n = window.i18n || i18next;

      // Check current language
      const currentLanguage = i18n.language;
      result.currentLanguage = currentLanguage;

      // Check localStorage
      const storedLanguage = localStorage.getItem("i18nextLng");
      result.storedLanguage = storedLanguage;

      // Check if translation function works
      const translationWorks = typeof i18n.t === "function";
      result.translationFunctionAvailable = translationWorks;

      // Check if languages match
      if (currentLanguage !== storedLanguage) {
        result.issues.push(`Current language (${currentLanguage}) does not match stored language (${storedLanguage})`);
      }

      // Overall status
      if (result.issues.length === 0) {
        result.status = "ok";
      } else {
        result.status = "warning";
      }

      logger.info("i18n diagnostic results", result);
      return result;
    } catch (error) {
      logger.error("Error checking i18n", error);
      result.status = "error";
      result.issues.push(`Error checking i18n: ${error.message}`);
      return result;
    }
  },

  /**
   * Run all diagnostics checks
   */
  runAll: () => {
    logger.info("Running all diagnostics checks");

    const results = {
      imports: diagnostics.checkImports(),
      environment: diagnostics.getEnvironmentInfo(),
      localStorage: diagnostics.checkLocalStorage(),
      i18n: diagnostics.checkI18n(),
    };

    logger.info("All diagnostics complete", results);
    return results;
  },
};

export default diagnostics;
