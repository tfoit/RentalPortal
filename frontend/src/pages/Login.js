import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Paper, Typography, Alert, CircularProgress, Divider, Grid } from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { PageLayout } from "../components/layout";
import { Button } from "../components/ui";
import { combineStyles } from "../utils/styleUtils";

/**
 * Login page component
 * Uses consistent styling between Material UI and Tailwind
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to log in. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use combineStyles for consistent styling
  const paperStyles = combineStyles("p-8 max-w-md w-full mx-auto shadow-soft rounded-xl", {});

  const textFieldStyles = combineStyles("bg-white dark:bg-background-dark", {});

  const formFooterStyles = combineStyles("mt-6 text-center text-charcoal-500 dark:text-darkText-secondary", {});

  return (
    <PageLayout title="Login to Rental Portal" subtitle="Enter your credentials to access your account" variant="centered">
      <Paper elevation={0} className={paperStyles.className} sx={paperStyles.sx}>
        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Email Address" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" autoComplete="email" className={textFieldStyles.className} sx={textFieldStyles.sx} />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Password" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" autoComplete="current-password" className={textFieldStyles.className} sx={textFieldStyles.sx} />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="primary" size="lg" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />} className="py-3 font-medium">
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Divider className="my-2">
                <Typography variant="body2" className="text-charcoal-500 dark:text-darkText-secondary">
                  OR
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12}>
              <Box className="text-center">
                <Typography variant="body2" className="mb-2 text-charcoal-600 dark:text-darkText">
                  Don't have an account?
                </Typography>
                <Button component={Link} to="/register" variant="outline" fullWidth>
                  Create an Account
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Box className={formFooterStyles.className} sx={formFooterStyles.sx}>
        <Typography variant="body2">
          By logging in, you agree to our{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default Login;
