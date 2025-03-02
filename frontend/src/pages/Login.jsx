import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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
import LanguageSelector from '../components/LanguageSelector';
import enhancedLogger from '../utils/enhancedLogger';

const Login = () => {
  const { t } = useTranslation('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Log translation availability for debugging
  enhancedLogger.debug('Login component translations', {
    title: t('login.title', { defaultValue: 'Missing title translation' }),
    emailLabel: t('login.email_label', { defaultValue: 'Missing email_label translation' }),
    passwordLabel: t('login.password_label', { defaultValue: 'Missing password_label translation' })
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        throw new Error(t('login.error.required_fields', 'All fields are required'));
      }

      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Navigate immediately after successful login (no timeout needed as checkAuthStatus is now part of login)
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || t('login.error.invalid_credentials'));
      }
    } catch (err) {
      setError(err.message || t('login.error.general', 'Error logging in'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Language selector in the top-right */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <LanguageSelector variant="full" />
      </Box>
      
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
              {t('login.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('login.subtitle')}
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label={t('login.email_label')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                placeholder={t('login.email_placeholder')}
                required
                autoComplete="email"
              />

              <TextField
                fullWidth
                label={t('login.password_label')}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                placeholder={t('login.password_placeholder')}
                required
                autoComplete="current-password"
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

              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={t('login.remember_me')}
                  />
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
                    {t('login.forgot_password')}
                  </Link>
                </Grid>
              </Grid>

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
                {loading ? t('login.login_button', 'Signing in...') : t('login.login_button')}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('login.no_account')}{' '}
          <Link component={RouterLink} to="/register" variant="body2" underline="hover" sx={{ fontWeight: 500 }}>
            {t('login.register')}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login; 