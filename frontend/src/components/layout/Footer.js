import React from "react";
import { Link } from "react-router-dom";

/**
 * Footer component for site footer - streamlined earthy palette version
 * Ultra lightweight with minimal content and natural, earthy styling
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional class names
 * @returns {JSX.Element}
 */
const Footer = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-[#F5F2E9] dark:bg-gray-900 border-t border-[#D8CCAD] dark:border-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex justify-center md:justify-start space-x-5 text-sm">
            <Link to="/" className="text-[#3A5145] hover:text-[#4D6A59]">
              Home
            </Link>
            <Link to="/privacy" className="text-[#3A5145] hover:text-[#4D6A59]">
              Privacy
            </Link>
            <Link to="/terms" className="text-[#3A5145] hover:text-[#4D6A59]">
              Terms
            </Link>
            <Link to="/contact" className="text-[#3A5145] hover:text-[#4D6A59]">
              Contact
            </Link>
          </div>

          <p className="mt-4 md:mt-0 text-center md:text-right text-sm text-[#A18167]">
            &copy; {currentYear} <span className="font-medium">RentalPortal</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
