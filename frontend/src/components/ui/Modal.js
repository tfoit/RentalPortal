import React, { useEffect } from "react";

/**
 * Modal component for displaying content in a dialog
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.size - Modal size (sm, md, lg, xl)
 * @param {boolean} props.closeOnOverlayClick - Whether to close modal when overlay is clicked
 * @param {string} props.className - Additional class names
 * @returns {JSX.Element|null}
 */
const Modal = ({ isOpen, onClose, title, children, footer, size = "md", closeOnOverlayClick = true, className = "" }) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity" onClick={handleOverlayClick}>
      <div
        className={`
          bg-white rounded-lg shadow-xl overflow-hidden w-full 
          ${sizeClasses[size] || sizeClasses.md}
          transform transition-all duration-300 ease-in-out
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 id="modal-title" className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose} aria-label="Close">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Modal body */}
        <div className="px-6 py-4">{children}</div>

        {/* Modal footer */}
        {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
