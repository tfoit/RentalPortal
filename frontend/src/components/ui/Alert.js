import React from "react";
import { colors } from "../../styles/theme";

/**
 * Alert component for displaying messages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Alert content
 * @param {string} [props.variant='info'] - Alert variant (info, success, warning, error)
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.dismissible=false] - Whether the alert can be dismissed
 * @param {Function} [props.onDismiss] - Callback when alert is dismissed
 * @param {Object} [props.icon] - Icon to display
 */
const Alert = ({ children, variant = "info", className = "", dismissible = false, onDismiss, icon, ...rest }) => {
  // Variant classes
  const variantClasses = {
    info: "bg-blue-50 text-blue-800 border-l-4 border-blue-500",
    success: "bg-green-50 text-green-800 border-l-4 border-green-500",
    warning: "bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500",
    error: "bg-red-50 text-red-800 border-l-4 border-red-500",
  };

  // Combine all classes
  const alertClasses = `
    p-4 rounded-r-lg
    ${variantClasses[variant] || variantClasses.info}
    ${className}
  `;

  return (
    <div className={alertClasses} role="alert" {...rest}>
      <div className="flex">
        {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
        <div className="flex-1">{children}</div>
        {dismissible && (
          <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8" onClick={onDismiss} aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
