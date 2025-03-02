/**
 * Theme Colors Utility
 *
 * This utility provides the theme colors for programmatic use in JavaScript.
 * Use this when you need to access theme colors outside of Tailwind classes.
 */

export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: "#5A7BFF", // Soft Slate Blue
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  background: {
    DEFAULT: "#F9FAFB", // Warm Off-White
    100: "#F3F4F6",
    200: "#E5E7EB",
    dark: "#1A202C", // Dark Background
  },

  // Secondary Colors
  sage: {
    DEFAULT: "#A3BFFA", // Sage Green
    50: "#F5F7FF",
    100: "#EBEEFF",
    200: "#D6DEFF",
    300: "#C2CEFF",
    500: "#8DA2FB",
    600: "#7886F8",
    700: "#6366F1",
    800: "#4F46E5",
    900: "#4338CA",
  },
  charcoal: {
    DEFAULT: "#2D3748", // Charcoal Gray
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    900: "#1E293B",
  },

  // Accent Colors
  peach: {
    DEFAULT: "#FF8A65", // Warm Peach
    50: "#FFF5F2",
    100: "#FFE8E0",
    200: "#FFCDBF",
    300: "#FFAC99",
    400: "#FF9B82",
    600: "#F87459",
    700: "#EC5E4E",
    800: "#DC4C44",
    900: "#C73F3A",
  },
  amber: {
    DEFAULT: "#FBBF24", // Golden Amber
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  // Dark Mode Text
  darkText: {
    DEFAULT: "#E2E8F0",
    secondary: "#CBD5E1",
    muted: "#94A3B8",
  },
};

// Common color combinations for gradients
export const gradients = {
  primary: `linear-gradient(to right, ${colors.primary.DEFAULT}, ${colors.primary[600]})`,
  sage: `linear-gradient(to right, ${colors.sage.DEFAULT}, ${colors.sage[600]})`,
  peach: `linear-gradient(to right, ${colors.peach.DEFAULT}, ${colors.peach[600]})`,
  amber: `linear-gradient(to right, ${colors.amber.DEFAULT}, ${colors.amber[600]})`,
  mixed: {
    primarySage: `linear-gradient(to right, ${colors.primary.DEFAULT}, ${colors.sage.DEFAULT})`,
    peachAmber: `linear-gradient(to right, ${colors.peach.DEFAULT}, ${colors.amber.DEFAULT})`,
  },
};

// Status colors for common app states
export const statusColors = {
  success: colors.sage.DEFAULT,
  warning: colors.amber.DEFAULT,
  error: colors.peach.DEFAULT,
  info: colors.primary.DEFAULT,
};

// Generate CSS variables for React components
export const getCssVariables = () => {
  return {
    "--color-primary": colors.primary.DEFAULT,
    "--color-background": colors.background.DEFAULT,
    "--color-sage": colors.sage.DEFAULT,
    "--color-charcoal": colors.charcoal.DEFAULT,
    "--color-peach": colors.peach.DEFAULT,
    "--color-amber": colors.amber.DEFAULT,
  };
};

export default {
  colors,
  gradients,
  statusColors,
  getCssVariables,
};
