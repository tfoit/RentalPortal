import React from "react";

/**
 * Checkbox component
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Checkbox id
 * @param {string} props.name - Checkbox name
 * @param {string} props.label - Checkbox label
 * @param {boolean} props.checked - Whether checkbox is checked
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether checkbox is disabled
 * @param {string} props.className - Additional class names
 * @param {string} props.labelClassName - Additional class names for label
 * @returns {JSX.Element}
 */
const Checkbox = ({ id, name, label, checked, onChange, error, disabled = false, className = "", labelClassName = "", ...rest }) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-4 w-4 rounded 
            focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
            text-primary-600 border-gray-300 transition duration-150 ease-in-out
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...rest}
        />
      </div>
      {label && (
        <div className="ml-2 text-sm">
          <label
            htmlFor={id}
            className={`
              font-medium 
              ${disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700"} 
              ${error ? "text-red-500" : ""}
              ${labelClassName}
            `}
          >
            {label}
          </label>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
