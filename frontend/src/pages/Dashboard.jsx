import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Avatar
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentsIcon from '@mui/icons-material/Payments';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../services/dashboardService';
import enhancedLogger from '../utils/enhancedLogger';

// Stat card component for displaying statistics
const StatCard = ({ icon, title, value, color }) => (
  <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
    <CardContent sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {title}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Status chip component for displaying status
const StatusChip = ({ status }) => {
  const { t } = useTranslation('common');
  let color = 'default';
  
  switch (status.toLowerCase()) {
    case 'available':
    case 'active':
    case 'completed':
      color = 'success';
      break;
    case 'pending':
      color = 'warning';
      break;
    case 'rented':
      color = 'info';
      break;
    case 'maintenance':
    case 'expired':
      color = 'error';
      break;
    default:
      color = 'default';
  }
  
  return (
    <Chip 
      label={t(`status.${status.toLowerCase()}`, status)} 
      color={color} 
      size="small" 
      sx={{ 
        textTransform: 'capitalize',
        fontWeight: 500
      }} 
    />
  );
};

const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Log translation availability for debugging
    enhancedLogger.debug('Dashboard component translations', {
      welcome: t('welcome', { name: user?.username || 'User', defaultValue: 'Welcome back!' }),
      overview: t('overview', { defaultValue: 'Here\'s what\'s happening with your properties.' })
    });

    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        enhancedLogger.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [t, user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          {t('loading', 'Loading dashboard...')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {t('welcome', { name: user?.username || 'User' })}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('overview', 'Here\'s what\'s happening with your properties today.')}
        </Typography>
      </Box>

      {/* Statistics section */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<ApartmentIcon fontSize="large" />} 
            title={t('statistics.apartments.title', 'Apartments')} 
            value={dashboardData.statistics.apartments} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<PeopleIcon fontSize="large" />} 
            title={t('statistics.tenants.title', 'Tenants')} 
            value={dashboardData.statistics.tenants} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<DescriptionIcon fontSize="large" />} 
            title={t('statistics.contracts.title', 'Contracts')} 
            value={dashboardData.statistics.contracts} 
            color="warning" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<PaymentsIcon fontSize="large" />} 
            title={t('statistics.payments.title', 'Payments')} 
            value={dashboardData.statistics.payments} 
            color="info" 
          />
        </Grid>
      </Grid>

      {/* Recent items section */}
      <Grid container spacing={3}>
        {/* Recent apartments */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {t('recent.apartments.title', 'Recent Apartments')}
                  </Typography>
                  <Button 
                    component={RouterLink} 
                    to="/apartments" 
                    endIcon={<ArrowForwardIcon />}
                    sx={{ fontWeight: 500 }}
                  >
                    {t('recent.apartments.view_all', 'View All')}
                  </Button>
                </Box>
              </Box>
              <Divider />
              <List sx={{ p: 0 }}>
                {dashboardData.recentApartments.length === 0 ? (
                  <ListItem sx={{ py: 2, px: 3 }}>
                    <ListItemText primary={t('recent.apartments.empty', 'No recent apartments to display')} />
                  </ListItem>
                ) : (
                  dashboardData.recentApartments.map((apartment) => (
                    <ListItem 
                      key={apartment.id}
                      component={RouterLink}
                      to={`/apartments/${apartment.id}`}
                      sx={{ 
                        py: 2,
                        px: 3,
                        '&:hover': { bgcolor: 'action.hover' },
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <ListItemText
                        primary={apartment.name}
                        secondary={apartment.address}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          €{apartment.price}
                        </Typography>
                        <StatusChip status={apartment.status} />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                )}
              </List>
              <Divider />
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={RouterLink}
                  to="/apartments/new"
                  sx={{ borderRadius: 2 }}
                >
                  {t('recent.apartments.add_new', 'Add New Apartment')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent contracts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {t('recent.contracts.title', 'Recent Contracts')}
                  </Typography>
                  <Button 
                    component={RouterLink} 
                    to="/contracts" 
                    endIcon={<ArrowForwardIcon />}
                    sx={{ fontWeight: 500 }}
                  >
                    {t('recent.contracts.view_all', 'View All')}
                  </Button>
                </Box>
              </Box>
              <Divider />
              <List sx={{ p: 0 }}>
                {dashboardData.recentContracts.length === 0 ? (
                  <ListItem sx={{ py: 2, px: 3 }}>
                    <ListItemText primary={t('recent.contracts.empty', 'No recent contracts to display')} />
                  </ListItem>
                ) : (
                  dashboardData.recentContracts.map((contract) => (
                    <ListItem 
                      key={contract.id}
                      component={RouterLink}
                      to={`/contracts/${contract.id}`}
                      sx={{ 
                        py: 2,
                        px: 3,
                        '&:hover': { bgcolor: 'action.hover' },
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <ListItemText
                        primary={contract.title}
                        secondary={contract.apartment}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          {new Date(contract.endDate).toLocaleDateString()}
                        </Typography>
                        <StatusChip status={contract.status} />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                )}
              </List>
              <Divider />
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={RouterLink}
                  to="/contracts/new"
                  sx={{ borderRadius: 2 }}
                >
                  {t('recent.contracts.add_new', 'Add New Contract')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 