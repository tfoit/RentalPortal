import React from "react";
import PropTypes from "prop-types";

/**
 * Badge Component
 *
 * A versatile badge component that supports different variants and sizes.
 * It uses the theme colors defined in our Tailwind configuration.
 */
const Badge = ({ children, variant = "primary", size = "md", rounded = "full", outline = false, dot = false, icon, className = "", ...props }) => {
  // Base classes for all badges
  const baseClasses = "inline-flex items-center justify-center font-medium";

  // Size classes
  const sizeClasses = {
    xs: dot ? "h-1.5 w-1.5" : "px-1.5 py-0.5 text-xs",
    sm: dot ? "h-2 w-2" : "px-2 py-0.5 text-xs",
    md: dot ? "h-2.5 w-2.5" : "px-2.5 py-0.5 text-xs",
    lg: dot ? "h-3 w-3" : "px-3 py-1 text-sm",
  };

  // Rounded corner classes
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  // Variant classes (solid background)
  const solidVariantClasses = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-800 dark:bg-opacity-20 dark:text-primary-300",
    secondary: "bg-sage-100 text-sage-800 dark:bg-sage-800 dark:bg-opacity-20 dark:text-sage-300",
    success: "bg-sage bg-opacity-10 text-sage dark:bg-sage-800 dark:bg-opacity-20 dark:text-sage-300",
    danger: "bg-peach bg-opacity-10 text-peach dark:bg-peach-800 dark:bg-opacity-20 dark:text-peach-300",
    warning: "bg-amber bg-opacity-10 text-amber-800 dark:bg-amber-800 dark:bg-opacity-20 dark:text-amber-300",
    info: "bg-primary bg-opacity-10 text-primary dark:bg-primary-800 dark:bg-opacity-20 dark:text-primary-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  // Variant classes (outline style)
  const outlineVariantClasses = {
    primary: "border border-primary text-primary",
    secondary: "border border-sage text-sage",
    success: "border border-sage text-sage",
    danger: "border border-peach text-peach",
    warning: "border border-amber text-amber-800",
    info: "border border-primary text-primary",
    gray: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  };

  // Dot badges have specific styles
  const dotClasses = dot ? "flex-shrink-0" : "";

  // Select the appropriate variant class based on outline prop
  const variantClass = outline ? outlineVariantClasses[variant] || outlineVariantClasses.primary : solidVariantClasses[variant] || solidVariantClasses.primary;

  // Combine all classes
  const badgeClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${roundedClasses[rounded] || roundedClasses.full}
    ${variantClass}
    ${dotClasses}
    ${className}
  `;

  // For dot badges, we just return a simple colored dot
  if (dot) {
    return <span className={badgeClasses} {...props}></span>;
  }

  return (
    <span className={badgeClasses} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger", "warning", "info", "gray"]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "full"]),
  outline: PropTypes.bool,
  dot: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Badge;
