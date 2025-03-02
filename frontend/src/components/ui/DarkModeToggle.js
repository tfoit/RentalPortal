import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useTheme } from "../../theme/ThemeProvider";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { combineStyles } from "../../utils/styleUtils";

/**
 * Dark Mode Toggle Component
 *
 * A toggle button for switching between light and dark mode.
 * Uses the ThemeProvider context to access and modify the theme.
 * Follows the consistent styling approach between Material UI and Tailwind.
 *
 * @param {string} className - Additional CSS classes
 * @param {boolean} minimal - Whether to show the minimal version (icon only)
 * @returns {JSX.Element}
 */
const DarkModeToggle = ({ className = "", minimal = false }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  // Use combineStyles for consistent styling
  const buttonStyles = combineStyles(`transition-all duration-300 ${className}`, {
    borderRadius: minimal ? "50%" : 8,
    bgcolor: darkMode ? "background.paper" : "rgba(255, 255, 255, 0.1)",
    "&:hover": {
      bgcolor: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.2)",
    },
  });

  const tooltipText = darkMode ? "Switch to light mode" : "Switch to dark mode";

  if (minimal) {
    return (
      <Tooltip title={tooltipText}>
        <IconButton onClick={toggleDarkMode} aria-label={tooltipText} className={buttonStyles.className} sx={buttonStyles.sx} size="small">
          {darkMode ? <LightModeIcon className="text-amber" fontSize="small" /> : <DarkModeIcon className="text-white" fontSize="small" />}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltipText}>
      <IconButton onClick={toggleDarkMode} aria-label={tooltipText} className={buttonStyles.className} sx={buttonStyles.sx} size="medium">
        <div className="flex items-center gap-2 px-1">
          {darkMode ? (
            <>
              <LightModeIcon className="text-amber" fontSize="small" />
              <span className="text-sm font-medium text-charcoal-800 dark:text-darkText">Light</span>
            </>
          ) : (
            <>
              <DarkModeIcon className="text-white" fontSize="small" />
              <span className="text-sm font-medium text-white">Dark</span>
            </>
          )}
        </div>
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
