import React from "react";
import { Button as MuiButton } from "@mui/material";
import { buttonStyles, colorMapping } from "../../utils/styleUtils";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Enhanced Button component that integrates Material UI with Tailwind CSS styling
 * Uses an Airbnb-inspired light design with rose as primary color
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline, text, success, warning, error)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.rounded - Whether button should be fully rounded
 * @param {string} props.className - Additional Tailwind classes
 * @param {React.ReactNode} props.startIcon - Icon to display before button text
 * @param {React.ReactNode} props.endIcon - Icon to display after button text
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether to show loading state
 * @param {string} props.component - Component to render as (for compatibility with React Router's Link)
 * @param {React.ReactNode} props.children - Button content
 * @returns {JSX.Element}
 */
const Button = ({ variant = "primary", size = "md", rounded = false, className = "", startIcon, endIcon, fullWidth = false, onClick, type = "button", disabled = false, loading = false, component, children, ...rest }) => {
  // Convert our variant name to MUI variant type
  const getMuiVariant = (variantName) => {
    switch (variantName) {
      case "primary":
      case "secondary":
      case "error":
      case "warning":
      case "info":
      case "success":
        return "contained";
      case "outline":
        return "outlined";
      case "text":
        return "text";
      default:
        return "contained";
    }
  };

  // Get the appropriate MUI color based on our variant
  const getMuiColor = (variantName) => {
    if (variantName === "outline" || variantName === "text") {
      return "primary";
    }

    return Object.keys(colorMapping).includes(variantName) ? variantName : "primary";
  };

  // Size mapping for the MUI size prop
  const muiSizeMap = {
    sm: "small",
    md: "medium",
    lg: "large",
  };

  // For loading state
  const loadingIcon = loading ? <CircularProgress size={size === "sm" ? 16 : size === "lg" ? 24 : 20} color="inherit" className="mr-2" /> : null;

  // If we have both loading and startIcon, only show loading
  const finalStartIcon = loading ? loadingIcon : startIcon;

  // Combined styles
  const { className: tailwindClasses } = buttonStyles(variant, size, rounded, className);

  return (
    <MuiButton
      variant={getMuiVariant(variant)}
      color={getMuiColor(variant)}
      size={muiSizeMap[size] || "medium"}
      className={tailwindClasses}
      startIcon={finalStartIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      component={component}
      {...rest}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
