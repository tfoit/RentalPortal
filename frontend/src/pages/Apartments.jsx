import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  TextField, 
  InputAdornment, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTranslation } from 'react-i18next';
import { mockDashboardData } from '../services/dashboardService';
import PriceFormatter from '../components/PriceFormatter';

// Mock data for apartments - in a real app you would fetch this from an API
const MOCK_APARTMENTS = [
  ...mockDashboardData.recentApartments,
  { id: "apt5", name: "Downtown Loft", address: "202 High St, Berlin", status: "available", price: 1650 },
  { id: "apt6", name: "Garden Apartment", address: "303 Park Lane, Munich", status: "rented", price: 1400 },
  { id: "apt7", name: "Urban Studio", address: "404 City Center, Hamburg", status: "available", price: 1100 },
  { id: "apt8", name: "Family Home", address: "505 Suburb Rd, Frankfurt", status: "maintenance", price: 2200 },
];

// Status color mapping
const statusColors = {
  available: 'success',
  rented: 'primary',
  maintenance: 'warning',
  unavailable: 'error'
};

const Apartments = () => {
  const { t } = useTranslation(['common', 'apartments']);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);

  useEffect(() => {
    // Simulate API call
    const fetchApartments = async () => {
      try {
        // In a real app, this would be an API call
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setApartments(MOCK_APARTMENTS);
      } catch (error) {
        console.error('Error fetching apartments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Apply filters
  const filteredApartments = apartments.filter(apartment => {
    // Apply search filter
    const matchesSearch = 
      apartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apartment.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || apartment.status === statusFilter;
    
    // Apply price filter
    const matchesPrice = 
      apartment.price >= priceRange[0] && 
      apartment.price <= priceRange[1];
    
    return matchesSearch && matchesStatus && matchesPrice;
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handlePriceMinChange = (event) => {
    const newMin = parseInt(event.target.value) || 0;
    setPriceRange([newMin, priceRange[1]]);
  };

  const handlePriceMaxChange = (event) => {
    const newMax = parseInt(event.target.value) || 5000;
    setPriceRange([priceRange[0], newMax]);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {t('apartments:title', 'Apartments')}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => console.log('Add new apartment')}
        >
          {t('apartments:actions.add_new', 'Add New')}
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t('apartments:filters.status', 'Status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('apartments:filters.status', 'Status')}
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">{t('common:filters.all', 'All')}</MenuItem>
                <MenuItem value="available">{t('apartments:status.available', 'Available')}</MenuItem>
                <MenuItem value="rented">{t('apartments:status.rented', 'Rented')}</MenuItem>
                <MenuItem value="maintenance">{t('apartments:status.maintenance', 'Maintenance')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label={t('apartments:filters.min_price', 'Min Price')}
              type="number"
              value={priceRange[0]}
              onChange={handlePriceMinChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label={t('apartments:filters.max_price', 'Max Price')}
              type="number"
              value={priceRange[1]}
              onChange={handlePriceMaxChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredApartments.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <Typography variant="h6" color="text.secondary">
            {t('apartments:no_results', 'No apartments match your filters')}
          </Typography>
          <Button 
            sx={{ mt: 2 }} 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPriceRange([0, 5000]);
            }}
          >
            {t('common:actions.clear_filters', 'Clear Filters')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredApartments.map((apartment) => (
            <Grid item xs={12} sm={6} md={4} key={apartment.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/random/400x200/?apartment&sig=${apartment.id}`}
                  alt={apartment.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {apartment.name}
                    </Typography>
                    <Chip 
                      label={t(`apartments:status.${apartment.status}`, apartment.status)}
                      color={statusColors[apartment.status]}
                      size="small"
                    />
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                  >
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    {apartment.address}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" color="primary">
                    <PriceFormatter value={apartment.price} /> / {t('apartments:month', 'month')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">
                    {t('common:actions.view_details', 'View Details')}
                  </Button>
                  <Button size="small" color="primary">
                    {t('apartments:actions.manage', 'Manage')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Apartments; 