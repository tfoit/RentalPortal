import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: 12,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '6rem', sm: '10rem' },
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: '-0.02em',
              mb: 4,
            }}
          >
            404
          </Typography>
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 500 }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
              sx={{ borderRadius: 2 }}
            >
              Go to Home
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/"
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: 2 }}
            >
              Go Back
            </Button>
          </Stack>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="body2" color="text.secondary">
            Need help? Contact our{' '}
            <RouterLink to="/support" style={{ color: 'inherit', textDecoration: 'underline' }}>
              support team
            </RouterLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound; 