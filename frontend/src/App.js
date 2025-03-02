import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container, CircularProgress, Box, Typography, Paper } from "@mui/material";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ApartmentList from "./pages/ApartmentList";
import ApartmentDetail from "./pages/ApartmentDetail";
import ApartmentForm from "./pages/ApartmentForm";
import NotFound from "./pages/NotFound";

// Components
import { MainLayout } from "./components/layout";
import PrivateRoute from "./components/PrivateRoute";

// Auth Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Theme Provider
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";

// Import styles
import "./styles/tailwind.css";

function AppRoutes() {
  const { user, loading, logout } = useAuth();
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }} className={darkMode ? "dark" : ""}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainLayout>
      <Container className="container py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/apartments" element={<ApartmentList />} />
          <Route path="/apartments/:id" element={<ApartmentDetail />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/apartments/new"
            element={
              <PrivateRoute>
                <ApartmentForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/apartments/edit/:id"
            element={
              <PrivateRoute>
                <ApartmentForm />
              </PrivateRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
