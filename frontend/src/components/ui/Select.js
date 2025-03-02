import React from "react";

/**
 * Select component for dropdown selections
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Select id
 * @param {string} props.name - Select name
 * @param {string} props.label - Select label
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {Array} props.options - Array of options [{value, label}]
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether select is disabled
 * @param {boolean} props.required - Whether select is required
 * @param {string} props.className - Additional class names
 * @param {string} props.helperText - Helper text to display below select
 * @returns {JSX.Element}
 */
const Select = ({ id, name, label, value, onChange, onBlur, options = [], placeholder = "Select an option", error, disabled = false, required = false, className = "", helperText, ...rest }) => {
  // Base classes for the select field
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none bg-white";

  // Classes based on state (error, disabled)
  const stateClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : disabled ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-300 focus:border-primary-500 focus:ring-primary-200 hover:border-primary-400";

  // Combine all classes
  const selectClasses = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={id} className={`block mb-1 font-medium ${error ? "text-red-500" : "text-gray-700"}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select id={id} name={name} value={value} onChange={onChange} onBlur={onBlur} disabled={disabled} required={required} className={selectClasses} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {(error || helperText) && <p className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>{error || helperText}</p>}
    </div>
  );
};

export default Select;
