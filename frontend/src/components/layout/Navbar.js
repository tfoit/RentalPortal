import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Navbar component for site navigation
 * Uses natural earthy color palette with sage green as primary
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional class names
 * @returns {JSX.Element}
 */
const Navbar = ({ className = "" }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Close profile menu when clicking outside
  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    const links = [
      { to: "/dashboard", label: "Dashboard", showFor: ["admin", "owner", "tenant"] },
      { to: "/apartments", label: "Apartments", showFor: ["admin", "owner", "tenant"] },
      { to: "/tenants", label: "Tenants", showFor: ["admin", "owner"] },
      { to: "/maintenance", label: "Maintenance", showFor: ["admin", "owner", "tenant"] },
      { to: "/payments", label: "Payments", showFor: ["admin", "owner", "tenant"] },
      { to: "/documents", label: "Documents", showFor: ["admin", "owner", "tenant"] },
    ];

    if (!user) return links.filter((link) => !link.showFor);

    return links.filter((link) => link.showFor.includes(user.role));
  };

  return (
    <nav className={`bg-[#F5F2E9] shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-[#4D6A59] font-bold text-xl">
                RentalPortal
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user &&
                getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                    ${isActive(link.to) ? "border-[#4D6A59] text-[#3A5145]" : "border-transparent text-[#607B6B] hover:border-[#D8CCAD] hover:text-[#4D6A59]"}
                  `}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div>
                  <button type="button" className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D6A59]" id="user-menu" aria-expanded="false" aria-haspopup="true" onClick={toggleProfileMenu}>
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-[#EFE9D9] flex items-center justify-center text-[#4D6A59]">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                  </button>
                </div>

                {/* Profile dropdown */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-[#3A5145] hover:bg-[#F5F2E9]" role="menuitem" onClick={closeProfileMenu}>
                      Your Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-[#3A5145] hover:bg-[#F5F2E9]" role="menuitem" onClick={closeProfileMenu}>
                      Settings
                    </Link>
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-[#3A5145] hover:bg-[#F5F2E9]"
                      role="menuitem"
                      onClick={() => {
                        closeProfileMenu();
                        logout();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#4D6A59] bg-[#EFE9D9] hover:bg-[#E5DCC4]">
                  Log in
                </Link>
                <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#4D6A59] hover:bg-[#3A5145]">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-[#607B6B] hover:text-[#4D6A59] hover:bg-[#EFE9D9] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4D6A59]" aria-controls="mobile-menu" aria-expanded="false" onClick={toggleMenu}>
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          {user &&
            getNavLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                ${isActive(link.to) ? "bg-[#EFE9D9] border-[#4D6A59] text-[#4D6A59]" : "border-transparent text-[#607B6B] hover:bg-[#F5F2E9] hover:border-[#D8CCAD] hover:text-[#4D6A59]"}
              `}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
        </div>

        {/* Mobile profile section */}
        {user ? (
          <div className="pt-4 pb-3 border-t border-[#E5DCC4]">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-[#EFE9D9] flex items-center justify-center text-[#4D6A59]">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-[#3A5145]">{user.name || "User"}</div>
                <div className="text-sm font-medium text-[#607B6B]">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link to="/profile" className="block px-4 py-2 text-base font-medium text-[#607B6B] hover:text-[#3A5145] hover:bg-[#F5F2E9]" onClick={() => setIsMenuOpen(false)}>
                Your Profile
              </Link>
              <Link to="/settings" className="block px-4 py-2 text-base font-medium text-[#607B6B] hover:text-[#3A5145] hover:bg-[#F5F2E9]" onClick={() => setIsMenuOpen(false)}>
                Settings
              </Link>
              <button
                className="w-full text-left block px-4 py-2 text-base font-medium text-[#607B6B] hover:text-[#3A5145] hover:bg-[#F5F2E9]"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-[#E5DCC4]">
            <div className="flex flex-col space-y-2 px-4">
              <Link to="/login" className="block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-[#4D6A59] bg-[#EFE9D9] hover:bg-[#E5DCC4]" onClick={() => setIsMenuOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#4D6A59] hover:bg-[#3A5145]" onClick={() => setIsMenuOpen(false)}>
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
