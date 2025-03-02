import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * MainLayout component that wraps the entire application with a consistent layout
 * Uses natural earthy color palette with light cream background
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the layout
 * @param {boolean} props.hideFooter - Whether to hide the footer
 * @param {string} props.className - Additional class names for the main content area
 * @returns {JSX.Element}
 */
const MainLayout = ({ children, hideFooter = false, className = "" }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F2E9]">
      <Navbar />

      <main className={`flex-grow ${className}`}>{children}</main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
