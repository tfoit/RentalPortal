import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem, useMediaQuery, useTheme as useMuiTheme } from "@mui/material";
import { Menu as MenuIcon, Apartment as ApartmentIcon } from "@mui/icons-material";
import { DarkModeToggle } from "./ui";
import { useTheme } from "../theme/ThemeProvider";
import { Button } from "./ui";
import { combineStyles } from "../utils/styleUtils";

/**
 * Main navigation component
 * Uses consistent styling between Material UI and Tailwind
 */
const Navbar = ({ user, onLogout }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const muiTheme = useMuiTheme();
  const { darkMode } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  // Debug user auth state
  useEffect(() => {
    console.log("Navbar received user:", user);
  }, [user]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    onLogout();
  };

  // Use combineStyles for consistent styling
  const appBarStyles = combineStyles("shadow-md backdrop-blur-sm", {
    marginBottom: 4,
    backgroundColor: darkMode ? "rgba(45, 55, 72, 0.95)" : "rgba(90, 123, 255, 0.95)",
    transition: "background-color 0.3s ease",
  });

  // Style for nav links
  const navLinkStyles = "font-medium text-white hover:text-blue-100 transition-colors";

  return (
    <AppBar position="static" className={appBarStyles.className} sx={appBarStyles.sx}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo & Brand - Desktop */}
          <Box className="hidden md:flex items-center">
            <ApartmentIcon className="mr-2" />
            <Typography variant="h6" component={RouterLink} to="/" className="font-bold text-white no-underline" sx={{ mr: 2 }}>
              Rental Portal
            </Typography>
          </Box>

          {/* Mobile menu */}
          <Box className="flex md:hidden">
            <IconButton size="large" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              className="block md:hidden"
            >
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/apartments">
                <Typography textAlign="center">Apartments</Typography>
              </MenuItem>
              {user && (
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/dashboard">
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Logo & Brand - Mobile */}
          <Box className="flex md:hidden items-center flex-grow">
            <ApartmentIcon className="mr-2" />
            <Typography variant="h6" component={RouterLink} to="/" className="font-bold text-white no-underline">
              Rental Portal
            </Typography>
          </Box>

          {/* Desktop Nav Links */}
          <Box className="hidden md:flex flex-grow">
            <Button variant="text" component={RouterLink} to="/apartments" onClick={handleCloseNavMenu} className={navLinkStyles}>
              Apartments
            </Button>
            {user && (
              <Button variant="text" component={RouterLink} to="/dashboard" onClick={handleCloseNavMenu} className={navLinkStyles}>
                Dashboard
              </Button>
            )}
          </Box>

          {/* Right side - Dark mode & User */}
          <Box className="flex items-center gap-4">
            <DarkModeToggle minimal={isMobile} />

            {user ? (
              <div>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} className="p-0">
                    <Avatar alt={user.username || "User"} src="/static/images/avatar/2.jpg" className="border-2 border-white" />
                  </IconButton>
                </Tooltip>
                <Menu
                  className="mt-12"
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/dashboard">
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/profile">
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <Box className="flex gap-2">
                <Button variant="text" component={RouterLink} to="/login" className={navLinkStyles}>
                  Login
                </Button>
                <Button variant="outlined" component={RouterLink} to="/register" className="text-white border-white hover:bg-white/10">
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
