import { createTheme } from "@mui/material/styles";

/**
 * Material UI theme configuration that matches Tailwind CSS theme colors
 * Natural, earthy design with sage green as the primary color
 */
const createMaterialTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        // Sage Green color
        light: "#607B6B", // lighter sage
        main: "#4D6A59", // sage green (DEFAULT)
        dark: "#3A5145", // darker sage
        contrastText: "#FFFFFF",
      },
      secondary: {
        // Cream color
        light: "#F5F2E9", // lighter cream
        main: "#EFE9D9", // cream (DEFAULT)
        dark: "#E5DCC4", // darker cream
        contrastText: "#4D6A59", // sage green
      },
      error: {
        // Warm brown for errors
        light: "#B3977D", // lighter brown
        main: "#A18167", // brown (DEFAULT)
        dark: "#8A6F57", // darker brown
        contrastText: "#FFFFFF",
      },
      warning: {
        // Tan from the palette
        light: "#E5DCC4", // lighter tan
        main: "#D8CCAD", // tan (DEFAULT)
        dark: "#C5B78F", // darker tan
        contrastText: "#4D6A59", // sage green
      },
      info: {
        // Lighter sage for info
        light: "#8FA99A", // much lighter sage
        main: "#607B6B", // lighter sage (DEFAULT)
        dark: "#4D6A59", // sage green
        contrastText: "#FFFFFF",
      },
      success: {
        // Darker sage for success
        light: "#607B6B", // lighter sage
        main: "#4D6A59", // sage green (DEFAULT)
        dark: "#3A5145", // darker sage
        contrastText: "#FFFFFF",
      },
      text: {
        primary: darkMode ? "#E2E8F0" : "#3A5145", // darker sage
        secondary: darkMode ? "#CBD5E1" : "#607B6B", // lighter sage
        disabled: darkMode ? "#94A3B8" : "#A7BAB1", // muted sage
      },
      background: {
        default: darkMode ? "#1A202C" : "#F5F2E9", // cream or dark gray
        paper: darkMode ? "#2D3748" : "#FFFFFF", // white or dark gray
      },
      divider: darkMode ? "rgba(226, 232, 240, 0.12)" : "rgba(214, 211, 202, 0.5)", // subtle beige
    },
    typography: {
      fontFamily: '"Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"',
      h1: {
        fontFamily: '"Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"',
        fontWeight: 600,
      },
      h4: {
        fontFamily: '"Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"',
        fontWeight: 600,
      },
      h5: {
        fontFamily: '"Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"',
        fontWeight: 500,
      },
      h6: {
        fontFamily: '"Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"',
        fontWeight: 500,
      },
      button: {
        textTransform: "none", // Prevent all-caps buttons
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8, // Match with Tailwind's default rounded
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // shadow-soft from Tailwind
            },
          },
          containedPrimary: {
            "&:hover": {
              backgroundColor: "#3A5145", // darker sage
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // shadow-soft from Tailwind
          },
          rounded: {
            borderRadius: 12, // rounded-xl in Tailwind
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // shadow-soft from Tailwind
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12, // rounded-xl in Tailwind
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // shadow-soft from Tailwind
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8, // rounded in Tailwind
              "& fieldset": {
                borderColor: "#E5DCC4", // tan
              },
              "&:hover fieldset": {
                borderColor: "#D8CCAD", // darker tan
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4D6A59", // sage green
              },
            },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: "#D8CCAD", // tan
            "&.Mui-checked": {
              color: "#4D6A59", // sage green
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "#D8CCAD", // tan
            "&.Mui-checked": {
              color: "#4D6A59", // sage green
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": {
              color: "#4D6A59", // sage green
              "& + .MuiSwitch-track": {
                backgroundColor: "#607B6B", // lighter sage
              },
            },
          },
        },
      },
    },
  });

export default createMaterialTheme;
