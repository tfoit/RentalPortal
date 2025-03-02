import React from "react";

/**
 * Input component for form fields
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Input id
 * @param {string} props.name - Input name
 * @param {string} props.type - Input type (text, password, email, etc)
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.className - Additional class names
 * @param {React.ReactNode} props.startIcon - Icon to display at start of input
 * @param {React.ReactNode} props.endIcon - Icon to display at end of input
 * @param {string} props.helperText - Helper text to display below input
 * @returns {JSX.Element}
 */
const Input = ({ id, name, type = "text", label, placeholder, value, onChange, onBlur, error, disabled = false, required = false, className = "", startIcon, endIcon, helperText, ...rest }) => {
  // Base classes for the input container
  const containerClasses = "relative w-full";

  // Base classes for the input field
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200";

  // Classes based on state (error, disabled)
  const stateClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : disabled ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-300 focus:border-primary-500 focus:ring-primary-200 hover:border-primary-400";

  // Classes for icons
  const iconClasses = startIcon ? "pl-10" : "";
  const endIconClasses = endIcon ? "pr-10" : "";

  // Combine all classes
  const inputClasses = `${baseClasses} ${stateClasses} ${iconClasses} ${endIconClasses} ${className}`;

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className={`block mb-1 font-medium ${error ? "text-red-500" : "text-gray-700"}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{startIcon}</div>}

        <input id={id} name={name} type={type} value={value} onChange={onChange} onBlur={onBlur} disabled={disabled} required={required} placeholder={placeholder} className={inputClasses} {...rest} />

        {endIcon && <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{endIcon}</div>}
      </div>

      {(error || helperText) && <p className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>{error || helperText}</p>}
    </div>
  );
};

export default Input;
