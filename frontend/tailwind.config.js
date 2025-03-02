/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          DEFAULT: "#5A7BFF", // Soft Slate Blue
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
          50: "#F5F7FF",
          100: "#EBEEFF",
          200: "#D6DEFF",
          300: "#C2CEFF",
          DEFAULT: "#A3BFFA", // Sage Green
          500: "#8DA2FB",
          600: "#7886F8",
          700: "#6366F1",
          800: "#4F46E5",
          900: "#4338CA",
        },
        charcoal: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          DEFAULT: "#2D3748", // Charcoal Gray
          900: "#1E293B",
        },

        // Accent Colors
        peach: {
          50: "#FFF5F2",
          100: "#FFE8E0",
          200: "#FFCDBF",
          300: "#FFAC99",
          400: "#FF9B82",
          DEFAULT: "#FF8A65", // Warm Peach
          600: "#F87459",
          700: "#EC5E4E",
          800: "#DC4C44",
          900: "#C73F3A",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          DEFAULT: "#FBBF24", // Golden Amber
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
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Poppins", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-hover": "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        neumorphic: "5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff",
        "neumorphic-inset": "inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff",
        none: "none",
      },

      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },

      transitionDuration: {
        DEFAULT: "150ms",
        fast: "100ms",
        normal: "200ms",
        slow: "300ms",
        slower: "500ms",
        slowest: "700ms",
      },

      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-in-out",
        "slide-down": "slideDown 0.3s ease-in-out",
        "slide-in-right": "slideInRight 0.3s ease-in-out",
        "slide-in-left": "slideInLeft 0.3s ease-in-out",
        "bounce-light": "bounceLight 2s infinite",
        "pulse-light": "pulseLight 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        bounceLight: {
          "0%, 100%": {
            transform: "translateY(-5%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        pulseLight: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },

      backdropBlur: {
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },

      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },

      gradientColorStops: {
        "primary-sage": ["#5A7BFF", "#A3BFFA"],
        "peach-amber": ["#FF8A65", "#FBBF24"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};
