import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';

// Mock data for tenants - in a real app you would fetch this from an API
const MOCK_TENANTS = [
  { id: "t1", name: "John Doe", email: "john.doe@example.com", phone: "+49 123 456 7890", apartment: "Luxury Studio", status: "active", verified: true, avatar: "JD" },
  { id: "t2", name: "Jane Smith", email: "jane.smith@example.com", phone: "+49 234 567 8901", apartment: "Modern 2BR", status: "active", verified: true, avatar: "JS" },
  { id: "t3", name: "Robert Johnson", email: "robert.j@example.com", phone: "+49 345 678 9012", apartment: "Downtown Loft", status: "former", verified: true, avatar: "RJ" },
  { id: "t4", name: "Sarah Williams", email: "s.williams@example.com", phone: "+49 456 789 0123", apartment: "Garden Apartment", status: "active", verified: false, avatar: "SW" },
  { id: "t5", name: "Michael Brown", email: "m.brown@example.com", phone: "+49 567 890 1234", apartment: "Luxury Studio", status: "active", verified: true, avatar: "MB" },
  { id: "t6", name: "Emily Davis", email: "emily.d@example.com", phone: "+49 678 901 2345", apartment: "Pending Assignment", status: "pending", verified: false, avatar: "ED" },
  { id: "t7", name: "David Wilson", email: "david.w@example.com", phone: "+49 789 012 3456", apartment: "Cozy 1BR", status: "active", verified: true, avatar: "DW" },
  { id: "t8", name: "Lisa Taylor", email: "lisa.t@example.com", phone: "+49 890 123 4567", apartment: "Pending Assignment", status: "pending", verified: true, avatar: "LT" },
  { id: "t9", name: "Thomas Anderson", email: "t.anderson@example.com", phone: "+49 901 234 5678", apartment: "Penthouse Suite", status: "active", verified: true, avatar: "TA" },
];

// Status color mapping
const statusColors = {
  active: 'success',
  pending: 'warning',
  former: 'default'
};

// String avatar colors
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const Tenants = () => {
  const { t } = useTranslation(['common', 'tenants']);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    const fetchTenants = async () => {
      try {
        // In a real app, this would be an API call
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setTenants(MOCK_TENANTS);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Apply filters
  const filteredTenants = tenants.filter(tenant => {
    // Apply search filter
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.apartment.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    
    // Apply verification filter
    const matchesVerification = 
      verificationFilter === 'all' || 
      (verificationFilter === 'verified' && tenant.verified) || 
      (verificationFilter === 'unverified' && !tenant.verified);
    
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleVerificationFilterChange = (event) => {
    setVerificationFilter(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {t('tenants:title', 'Tenants')}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => console.log('Add new tenant')}
        >
          {t('tenants:actions.add_new', 'Add New')}
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('common:actions.search', 'Search')}
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('tenants:filters.status', 'Status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('tenants:filters.status', 'Status')}
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">{t('common:filters.all', 'All')}</MenuItem>
                <MenuItem value="active">{t('tenants:status.active', 'Active')}</MenuItem>
                <MenuItem value="pending">{t('tenants:status.pending', 'Pending')}</MenuItem>
                <MenuItem value="former">{t('tenants:status.former', 'Former')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('tenants:filters.verification', 'Verification')}</InputLabel>
              <Select
                value={verificationFilter}
                label={t('tenants:filters.verification', 'Verification')}
                onChange={handleVerificationFilterChange}
              >
                <MenuItem value="all">{t('common:filters.all', 'All')}</MenuItem>
                <MenuItem value="verified">{t('tenants:verification.verified', 'Verified')}</MenuItem>
                <MenuItem value="unverified">{t('tenants:verification.unverified', 'Unverified')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredTenants.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <Typography variant="h6" color="text.secondary">
            {t('tenants:no_results', 'No tenants match your filters')}
          </Typography>
          <Button 
            sx={{ mt: 2 }} 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setVerificationFilter('all');
            }}
          >
            {t('common:actions.clear_filters', 'Clear Filters')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTenants.map((tenant) => (
            <Grid item xs={12} sm={6} md={4} key={tenant.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: stringToColor(tenant.name),
                          mr: 2, 
                          height: 56, 
                          width: 56,
                          fontSize: '1.2rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {tenant.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                          {tenant.name}
                          {tenant.verified && (
                            <VerifiedIcon 
                              color="primary" 
                              sx={{ ml: 0.5, fontSize: '1rem' }} 
                              titleAccess={t('tenants:verification.verified', 'Verified')}
                            />
                          )}
                        </Typography>
                        <Chip 
                          label={t(`tenants:status.${tenant.status}`, tenant.status)}
                          color={statusColors[tenant.status]}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <List dense disablePadding>
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <EmailIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={tenant.email} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          color: 'text.secondary',
                          sx: { wordBreak: 'break-all' }
                        }} 
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PhoneIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={tenant.phone}
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HomeIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={tenant.apartment}
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
                <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button size="small" variant="outlined">
                    {t('tenants:actions.view_profile', 'View Profile')}
                  </Button>
                  <Button size="small" color="primary">
                    {t('tenants:actions.message', 'Message')}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Tenants; 