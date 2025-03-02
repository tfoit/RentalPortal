import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Paper, Typography, Alert, CircularProgress, Divider, Grid, FormControl, FormControlLabel, Radio, RadioGroup, FormHelperText } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { PageLayout } from "../components/layout";
import { Button } from "../components/ui";
import { combineStyles } from "../utils/styleUtils";

/**
 * Register page component
 * Uses consistent styling between Material UI and Tailwind
 * Matches natural, earthy design with sage green as the primary color
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "tenant",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user makes a change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setError("");
      setLoading(true);

      await register(formData.name, formData.email, formData.password, formData.role);

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to create an account. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Use combineStyles for consistent styling
  const paperStyles = combineStyles("p-8 max-w-md w-full mx-auto shadow-sm rounded-xl", {});

  const textFieldStyles = combineStyles("bg-white dark:bg-gray-800", {});

  const formFooterStyles = combineStyles("mt-6 text-center text-[#4D6A59] dark:text-gray-400", {});

  const radioGroupStyles = combineStyles("flex flex-row gap-4", {});

  return (
    <PageLayout title="Create an Account" subtitle="Sign up to access the Rental Portal" variant="centered" bgColor="bg-[#F5F2E9]">
      <Paper elevation={0} className={paperStyles.className} sx={paperStyles.sx}>
        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Full Name" type="text" name="name" fullWidth required value={formData.name} onChange={handleChange} error={Boolean(errors.name)} helperText={errors.name} variant="outlined" autoComplete="name" className={textFieldStyles.className} sx={textFieldStyles.sx} />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Email Address" type="email" name="email" fullWidth required value={formData.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} variant="outlined" autoComplete="email" className={textFieldStyles.className} sx={textFieldStyles.sx} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                name="password"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password || "Password must be at least 6 characters"}
                variant="outlined"
                autoComplete="new-password"
                className={textFieldStyles.className}
                sx={textFieldStyles.sx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                type="password"
                name="passwordConfirm"
                fullWidth
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
                error={Boolean(errors.passwordConfirm)}
                helperText={errors.passwordConfirm}
                variant="outlined"
                autoComplete="new-password"
                className={textFieldStyles.className}
                sx={textFieldStyles.sx}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Typography variant="subtitle2" className="mb-2 text-[#3A5145] dark:text-gray-300">
                  I am a:
                </Typography>
                <RadioGroup name="role" value={formData.role} onChange={handleChange} className={radioGroupStyles.className} sx={radioGroupStyles.sx}>
                  <FormControlLabel value="tenant" control={<Radio />} label="Tenant" />
                  <FormControlLabel value="owner" control={<Radio />} label="Property Owner" />
                </RadioGroup>
                <FormHelperText className="text-[#4D6A59]">Select your primary role in the rental portal</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="primary" size="lg" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonIcon />} className="py-3 font-medium">
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Divider className="my-2">
                <Typography variant="body2" className="text-[#4D6A59] dark:text-gray-400">
                  OR
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12}>
              <Box className="text-center">
                <Typography variant="body2" className="mb-2 text-[#3A5145] dark:text-gray-300">
                  Already have an account?
                </Typography>
                <Button component={Link} to="/login" variant="outline" fullWidth>
                  Log In
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Box className={formFooterStyles.className} sx={formFooterStyles.sx}>
        <Typography variant="body2">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-[#4D6A59] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-[#4D6A59] hover:underline">
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default Register;
