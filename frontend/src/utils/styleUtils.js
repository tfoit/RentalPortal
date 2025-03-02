/**
 * Style utilities for consistent styling between Material UI and Tailwind CSS
 * Provides helper functions to standardize component styling approach
 */

/**
 * Combines Tailwind classes with MUI sx prop styles
 * @param {string} className - Tailwind classes
 * @param {Object} sx - Material UI sx prop object
 * @returns {Object} Combined styling object with className and sx properties
 */
export const combineStyles = (className = "", sx = {}) => ({
  className,
  sx,
});

/**
 * Maps color variant names between systems
 * Use this to ensure naming consistency
 * Natural earthy palette with sage green as primary
 */
export const colorMapping = {
  primary: "sage-500", // Sage green (custom)
  secondary: "cream-100", // Cream (custom)
  success: "sage-600", // Darker sage
  info: "sage-400", // Lighter sage
  warning: "tan-300", // Tan (custom)
  error: "brown-500", // Brown (custom)
  default: "sage-900", // Darkest sage
};

/**
 * Gets the appropriate variant color class for Tailwind
 * @param {string} variant - The variant name (primary, secondary, etc.)
 * @param {string} type - The type of class (bg, text, border)
 * @returns {string} Tailwind class for the specified variant and type
 */
export const getVariantClass = (variant = "default", type = "bg") => {
  const color = colorMapping[variant] || variant;

  switch (type) {
    case "bg":
      return `${type}-${color}`;
    case "text":
      return `${type}-${color === "default" ? "charcoal" : "white"}`;
    case "border":
      return `${type}-${color}`;
    default:
      return "";
  }
};

/**
 * Combines Material UI and Tailwind classes for buttons
 * @param {string} variant - Button variant (primary, secondary, etc.)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} rounded - Whether button should be fully rounded
 * @param {string} className - Additional Tailwind classes
 * @returns {Object} Combined styling object
 */
export const buttonStyles = (variant = "primary", size = "md", rounded = false, className = "") => {
  // Map size to padding classes
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Standardized color classes for button variant types - Natural earthy palette
  const variantClasses = {
    // Primary buttons use sage green
    primary: "bg-[#4D6A59] hover:bg-[#3A5145] text-white",
    secondary: "bg-[#EFE9D9] hover:bg-[#E5DCC4] text-[#3A5145] border border-[#D8CCAD]",
    outline: "border border-[#D8CCAD] text-[#3A5145] hover:bg-[#F5F2E9] hover:border-[#A18167]",
    text: "text-[#3A5145] hover:bg-[#F5F2E9]",
    // Other variants use consistent coloring based on semantic meaning
    success: "bg-[#4D6A59] hover:bg-[#3A5145] text-white",
    warning: "bg-[#D8CCAD] hover:bg-[#C5B78F] text-[#3A5145]",
    error: "bg-[#A18167] hover:bg-[#8A6F57] text-white",
  };

  // Base Tailwind classes with improved consistency
  const tailwindClasses = `
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${rounded ? "rounded-full" : "rounded-md"}
    font-medium
    transition-all
    duration-200
    flex
    items-center
    justify-center
    ${className}
  `.trim();

  return {
    variant, // MUI variant
    className: tailwindClasses,
  };
};

/**
 * Get consistent shadow styles for both systems
 */
export const shadowStyles = {
  none: {
    tailwind: "shadow-none",
    mui: "none",
  },
  sm: {
    tailwind: "shadow-sm",
    mui: 1,
  },
  md: {
    tailwind: "shadow-md",
    mui: 2,
  },
  lg: {
    tailwind: "shadow-lg",
    mui: 4,
  },
  xl: {
    tailwind: "shadow-xl",
    mui: 8,
  },
  soft: {
    tailwind: "shadow-soft",
    mui: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
};

/**
 * Consistent spacing values between Material UI and Tailwind
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

/**
 * Get appropriate color for status states
 * @param {string} status - Status value
 * @returns {string} Appropriate variant color
 */
export const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "available":
      return "success";
    case "rented":
      return "primary";
    case "maintenance":
      return "warning";
    case "inactive":
      return "error";
    default:
      return "default";
  }
};
