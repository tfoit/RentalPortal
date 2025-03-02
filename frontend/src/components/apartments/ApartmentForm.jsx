import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Divider,
  Box,
  InputAdornment,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ApartmentForm = ({ open, onClose, onSave, initialData = null }) => {
  const { t } = useTranslation(['common', 'apartments']);
  const isEditMode = !!initialData;
  
  // Form state
  const [formData, setFormData] = useState(() => {
    return initialData || {
      title: '',
      location: '',
      status: 'available',
      rent: '',
      deposit: '',
      size: '',
      sizeUnit: 'sqm',
      currency: 'EUR',
      utilities: {
        electricity: '',
        internet: '',
        advancements: '',
      },
      bedrooms: '',
      bathrooms: '',
      hasParking: false,
      hasBalcony: false,
      hasGarden: false,
      hasFurnished: false,
      description: ''
    };
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleNestedChange = (nestedField, field, value) => {
    setFormData({
      ...formData,
      [nestedField]: {
        ...formData[nestedField],
        [field]: value
      }
    });
    
    // Clear error when field is edited
    const errorKey = `${nestedField}.${field}`;
    if (errors[errorKey]) {
      setErrors({
        ...errors,
        [errorKey]: null
      });
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.title) {
      newErrors.title = t('apartments:errors.required_name', 'Name is required');
    }
    
    if (!formData.location) {
      newErrors.location = t('apartments:errors.required_address', 'Address is required');
    }
    
    // Validate numeric fields
    if (!formData.rent || isNaN(formData.rent) || Number(formData.rent) <= 0) {
      newErrors.rent = t('apartments:errors.invalid_rent', 'Rent amount must be a positive number');
    }
    
    if (!formData.deposit || isNaN(formData.deposit) || Number(formData.deposit) <= 0) {
      newErrors.deposit = t('apartments:errors.invalid_deposit', 'Deposit amount must be a positive number');
    }
    
    if (!formData.size || isNaN(formData.size) || Number(formData.size) <= 0) {
      newErrors.size = t('apartments:errors.invalid_area', 'Area must be a positive number');
    }
    
    // Validate utilities
    if (!formData.utilities.electricity || isNaN(formData.utilities.electricity) || Number(formData.utilities.electricity) < 0) {
      newErrors['utilities.electricity'] = t('apartments:errors.invalid_electricity', 'Electricity cost must be a non-negative number');
    }
    
    if (!formData.utilities.internet || isNaN(formData.utilities.internet) || Number(formData.utilities.internet) < 0) {
      newErrors['utilities.internet'] = t('apartments:errors.invalid_internet', 'Internet cost must be a non-negative number');
    }
    
    if (!formData.utilities.advancements || isNaN(formData.utilities.advancements) || Number(formData.utilities.advancements) < 0) {
      newErrors['utilities.advancements'] = t('apartments:errors.invalid_advancements', 'Advancements must be a non-negative number');
    }
    
    if (!formData.currency) {
      newErrors.currency = t('apartments:errors.required_currency', 'Currency is required');
    }
    
    if (formData.bedrooms && (isNaN(formData.bedrooms) || Number(formData.bedrooms) < 0)) {
      newErrors.bedrooms = t('apartments:errors.invalid_bedrooms', 'Number of bedrooms must be a positive number');
    }
    
    if (formData.bathrooms && (isNaN(formData.bathrooms) || Number(formData.bathrooms) < 0)) {
      newErrors.bathrooms = t('apartments:errors.invalid_bathrooms', 'Number of bathrooms must be a positive number');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        rent: formData.rent ? Number(formData.rent) : null,
        deposit: formData.deposit ? Number(formData.deposit) : null,
        size: formData.size ? Number(formData.size) : null,
        utilities: {
          electricity: formData.utilities.electricity ? Number(formData.utilities.electricity) : null,
          internet: formData.utilities.internet ? Number(formData.utilities.internet) : null,
          advancements: formData.utilities.advancements ? Number(formData.utilities.advancements) : null,
        },
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      };
      
      onSave(processedData);
      onClose();
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        {isEditMode 
          ? t('apartments:form.edit_title', 'Edit Apartment') 
          : t('apartments:form.create_title', 'Add New Apartment')}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {t('apartments:form.basic_info', 'Basic Information')}
          </Typography>
          
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t('apartments:form.name', 'Name')}
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                placeholder={t('apartments:form.name_placeholder', 'Enter apartment name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('apartments:form.status', 'Status')}</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label={t('apartments:form.status', 'Status')}
                >
                  <MenuItem value="available">{t('apartments:status.available', 'Available')}</MenuItem>
                  <MenuItem value="rented">{t('apartments:status.rented', 'Rented')}</MenuItem>
                  <MenuItem value="maintenance">{t('apartments:status.maintenance', 'Maintenance')}</MenuItem>
                  <MenuItem value="unavailable">{t('apartments:status.unavailable', 'Unavailable')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label={t('apartments:form.street', 'Address')}
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                placeholder={t('apartments:form.street_placeholder', 'Enter street address')}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {t('apartments:form.features', 'Features')}
          </Typography>
          
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                required
                fullWidth
                label={t('apartments:form.price', 'Monthly Rent')}
                name="rent"
                type="number"
                value={formData.rent}
                onChange={handleChange}
                error={!!errors.rent}
                helperText={errors.rent}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                required
                fullWidth
                label={t('apartments:form.deposit', 'Security Deposit')}
                name="deposit"
                type="number"
                value={formData.deposit}
                onChange={handleChange}
                error={!!errors.deposit}
                helperText={errors.deposit}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label={t('apartments:form.bedrooms', 'Bedrooms')}
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                error={!!errors.bedrooms}
                helperText={errors.bedrooms}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label={t('apartments:form.bathrooms', 'Bathrooms')}
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                error={!!errors.bathrooms}
                helperText={errors.bathrooms}
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label={t('apartments:form.area', 'Area')}
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                error={!!errors.size}
                helperText={errors.size}
                InputProps={{
                  endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t('apartments:form.sizeUnit', 'Size Unit')}</InputLabel>
                <Select
                  name="sizeUnit"
                  value={formData.sizeUnit}
                  onChange={handleChange}
                  label={t('apartments:form.sizeUnit', 'Size Unit')}
                >
                  <MenuItem value="sqm">m² ({t('apartments:units.sqm', 'Square Meters')})</MenuItem>
                  <MenuItem value="sqft">ft² ({t('apartments:units.sqft', 'Square Feet')})</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required>
                <InputLabel>{t('apartments:form.currency', 'Currency')}</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  label={t('apartments:form.currency', 'Currency')}
                  error={!!errors.currency}
                >
                  <MenuItem value="EUR">€ (EUR)</MenuItem>
                  <MenuItem value="USD">$ (USD)</MenuItem>
                  <MenuItem value="GBP">£ (GBP)</MenuItem>
                  <MenuItem value="PLN">zł (PLN)</MenuItem>
                  <MenuItem value="CHF">Fr (CHF)</MenuItem>
                </Select>
                {errors.currency && <FormHelperText error>{errors.currency}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" gutterBottom fontWeight="bold" mt={2}>
            {t('apartments:form.utilities', 'Utilities')}
          </Typography>
          
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label={t('apartments:form.electricity', 'Electricity')}
                name="utilities.electricity"
                type="number"
                value={formData.utilities.electricity}
                onChange={(e) => handleNestedChange('utilities', 'electricity', e.target.value)}
                error={!!errors['utilities.electricity']}
                helperText={errors['utilities.electricity']}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label={t('apartments:form.internet', 'Internet')}
                name="utilities.internet"
                type="number"
                value={formData.utilities.internet}
                onChange={(e) => handleNestedChange('utilities', 'internet', e.target.value)}
                error={!!errors['utilities.internet']}
                helperText={errors['utilities.internet']}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label={t('apartments:form.advancements', 'Advancements')}
                name="utilities.advancements"
                type="number"
                value={formData.utilities.advancements}
                onChange={(e) => handleNestedChange('utilities', 'advancements', e.target.value)}
                error={!!errors['utilities.advancements']}
                helperText={errors['utilities.advancements']}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasParking}
                    onChange={handleSwitchChange}
                    name="hasParking"
                  />
                }
                label={t('apartments:form.parking', 'Parking')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasBalcony}
                    onChange={handleSwitchChange}
                    name="hasBalcony"
                  />
                }
                label={t('apartments:form.balcony', 'Balcony')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasGarden}
                    onChange={handleSwitchChange}
                    name="hasGarden"
                  />
                }
                label={t('apartments:form.garden', 'Garden')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasFurnished}
                    onChange={handleSwitchChange}
                    name="hasFurnished"
                  />
                }
                label={t('apartments:form.furnished', 'Furnished')}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {t('apartments:form.description', 'Description')}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('apartments:form.description', 'Description')}
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder={t('apartments:form.description_placeholder', 'Describe the apartment')}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>
          {t('common:actions.cancel', 'Cancel')}
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
        >
          {isEditMode 
            ? t('common:actions.save', 'Save') 
            : t('apartments:form.save', 'Save Apartment')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApartmentForm; 