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
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import PriceFormatter from '../components/PriceFormatter';
import ApartmentForm from '../components/apartments/ApartmentForm';
import apartmentService from '../services/apartmentService';
import enhancedLogger from '../utils/enhancedLogger';

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
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [formOpen, setFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Function to fetch apartments from service
  const fetchApartments = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      enhancedLogger.info('Fetching apartments with filters', { filters });
      
      // Create params object for the API call
      const params = {
        search: filters.search || searchTerm,
        status: filters.status || statusFilter,
        minPrice: filters.minPrice !== undefined ? filters.minPrice : priceRange[0],
        maxPrice: filters.maxPrice !== undefined ? filters.maxPrice : priceRange[1]
      };
      
      // Fetch apartments with params
      const data = await apartmentService.getApartments(params);
      setApartments(data);
      enhancedLogger.debug('Apartments fetched successfully', { count: data.length });
      
    } catch (err) {
      enhancedLogger.error('Error fetching apartments', { error: err });
      setError(err.message || 'Failed to load apartments');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchApartments();
  }, []);

  // Apply filters on the server-side
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

  // Apply filters button handler
  const handleApplyFilters = () => {
    fetchApartments({
      search: searchTerm,
      status: statusFilter,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriceRange([0, 5000]);
    
    // Fetch without filters
    fetchApartments({
      search: '',
      status: 'all',
      minPrice: 0,
      maxPrice: 5000
    });
  };

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const handleSaveApartment = async (formData) => {
    try {
      setLoading(true);
      
      // Create the apartment through the service
      const newApartment = await apartmentService.createApartment(formData);
      
      // Refresh the apartment list
      await fetchApartments();
      
      // Show success message
      setSnackbar({
        open: true,
        message: t('apartments:alerts.create_success', 'Apartment created successfully'),
        severity: 'success'
      });
      
    } catch (err) {
      enhancedLogger.error('Error creating apartment', { error: err });
      
      setSnackbar({
        open: true,
        message: err.message || t('apartments:alerts.create_error', 'Failed to create apartment'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Handle retry on error
  const handleRetry = () => {
    fetchApartments();
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
          onClick={handleOpenForm}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyFilters();
                }
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
          <Grid item xs={6} md={2}>
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
          <Grid item xs={6} md={2}>
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
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
            >
              {t('common:actions.clear', 'Clear')}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleApplyFilters}
              startIcon={<FilterListIcon />}
            >
              {t('common:actions.filter', 'Filter')}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 4, textAlign: 'center', my: 5 }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            {t('common:status.error', 'Error')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />} 
            onClick={handleRetry}
          >
            {t('common:actions.retry', 'Retry')}
          </Button>
        </Paper>
      ) : apartments.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <Typography variant="h6" color="text.secondary">
            {t('apartments:no_results', 'No apartments match your filters')}
          </Typography>
          <Button 
            sx={{ mt: 2 }} 
            onClick={handleClearFilters}
          >
            {t('common:actions.clear_filters', 'Clear Filters')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {apartments.map((apartment) => (
            <Grid item xs={12} sm={6} md={4} key={apartment._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/random/400x200/?apartment&sig=${apartment._id}`}
                  alt={apartment.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {apartment.title}
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
                    {apartment.location}
                  </Typography>
                  
                  {/* Show additional details if available */}
                  {(apartment.bedrooms || apartment.bathrooms || apartment.size) && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {apartment.bedrooms && (
                        <Typography variant="body2" color="text.secondary">
                          {t('apartments:card.bed', '{{count}} bedroom', { count: apartment.bedrooms })}
                        </Typography>
                      )}
                      {apartment.bathrooms && (
                        <Typography variant="body2" color="text.secondary">
                          {t('apartments:card.bath', '{{count}} bathroom', { count: apartment.bathrooms })}
                        </Typography>
                      )}
                      {apartment.size && (
                        <Typography variant="body2" color="text.secondary">
                          {apartment.size} {apartment.sizeUnit || 'm²'}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 'auto', pt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="h6" color="primary">
                        <PriceFormatter amount={apartment.rent} />
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('apartments:card.per_month', '/month')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    {t('common:actions.view_details', 'View Details')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Apartment Form Dialog */}
      <ApartmentForm 
        open={formOpen}
        onClose={handleCloseForm}
        onSave={handleSaveApartment}
      />

      {/* Success/Error Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Apartments; 