import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value,
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        username: formData.email.split('@')[0],
      };

      const result = await register(userData);

      if (result.success) {
        setSuccess(result.message || 'Registration successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setServerError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setServerError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card
        sx={{
          mb: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          borderRadius: 2,
          overflow: 'visible',
          position: 'relative',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Create an Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join EuroRentals to manage your properties efficiently
            </Typography>
          </Box>

          {serverError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {serverError}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                required
                error={!!errors.email}
                helperText={errors.email}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                required
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link component={RouterLink} to="/terms" underline="hover">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link component={RouterLink} to="/privacy" underline="hover">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                error={!!errors.agreeToTerms}
              />
              {errors.agreeToTerms && (
                <Typography variant="caption" color="error">
                  {errors.agreeToTerms}
                </Typography>
              )}

              <Button
                disableElevation
                disabled={loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  py: 1.5,
                  mt: 2,
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" variant="body2" underline="hover" sx={{ fontWeight: 500 }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register; 