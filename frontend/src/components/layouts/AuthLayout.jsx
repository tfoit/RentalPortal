import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, Link, Stack } from '@mui/material';
import LanguageSelector from '../LanguageSelector';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header with Language Selector */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          EuroRentals
        </Typography>

        <LanguageSelector variant="full" />
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{
          py: 8,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} EuroRentals. All rights reserved.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          mt={1}
        >
          <Link href="#" color="inherit" underline="hover">
            Terms
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Privacy
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Help
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

export default AuthLayout; 