import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageSelector from '../components/LanguageSelector';
import CurrencySelector from '../components/CurrencySelector';

const Profile = () => {
  const { t } = useTranslation(['profile', 'common']);
  const { user, updateUserProfile } = useAuth();
  const { currency } = useCurrency();
  const navigate = useNavigate();

  // User profile state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    postalCode: user?.postalCode || '',
    profileImage: user?.profileImage || '',
    bio: user?.bio || '',
  });

  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    allowContactFromOtherUsers: true,
    showContactInfo: false,
    showActivity: true,
  });

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle profile update
  const handleProfileUpdate = () => {
    updateUserProfile(profileData)
      .then(() => {
        handleNotification(t('profile:updateSuccess'), 'success');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        handleNotification(t('profile:updateError'), 'error');
      });
  };

  // Handle notification preferences update
  const handleNotificationSettingsUpdate = () => {
    // Update notification settings logic here
    // Mock successful update
    handleNotification(t('profile:notificationsUpdated'), 'success');
  };

  // Handle privacy settings update
  const handlePrivacySettingsUpdate = () => {
    // Update privacy settings logic here
    // Mock successful update
    handleNotification(t('profile:privacyUpdated'), 'success');
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // Handle notification preference changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences({
      ...notificationPreferences,
      [name]: checked,
    });
  };

  // Handle privacy setting changes
  const handlePrivacyChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Handle switch or select inputs
    if (typeof checked !== 'undefined') {
      setPrivacySettings({
        ...privacySettings,
        [name]: checked,
      });
    } else {
      setPrivacySettings({
        ...privacySettings,
        [name]: value,
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const handleNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            src={user?.avatarUrl}
            alt={`${user?.firstName} ${user?.lastName}`}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4">{`${user?.firstName} ${user?.lastName}`}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.role || t('profile:tenant')}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant={activeSection === 'profile' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('profile')}
                startIcon={<EditIcon />}
              >
                {t('profile:editProfile')}
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant={activeSection === 'language' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('language')}
                startIcon={<LanguageIcon />}
              >
                {t('profile:languageSettings')}
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant={activeSection === 'currency' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('currency')}
                startIcon={<AttachMoneyIcon />}
              >
                {t('profile:currencySettings')}
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant={activeSection === 'notifications' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('notifications')}
                startIcon={<NotificationsIcon />}
              >
                {t('profile:notifications')}
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant={activeSection === 'privacy' ? 'contained' : 'outlined'}
                onClick={() => setActiveSection('privacy')}
                startIcon={<SecurityIcon />}
              >
                {t('profile:privacySettings')}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            {activeSection === 'profile' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">{t('profile:personalInfo')}</Typography>
                  {!isEditing ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      variant="outlined"
                    >
                      {t('common:actions.edit')}
                    </Button>
                  ) : (
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={handleProfileUpdate}
                        sx={{ mr: 1 }}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setIsEditing(false)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('profile:firstName')}
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('profile:lastName')}
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('profile:email')}
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('profile:phone')}
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('profile:address')}
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label={t('profile:city')}
                      name="city"
                      value={profileData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label={t('profile:country')}
                      name="country"
                      value={profileData.country}
                      onChange={handleChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label={t('profile:postalCode')}
                      name="postalCode"
                      value={profileData.postalCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('profile:bio')}
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      multiline
                      rows={4}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeSection === 'language' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {t('profile:languageSettings')}
                </Typography>
                <Card sx={{ mb: 3 }}>
                  <CardHeader title={t('profile:selectLanguage')} />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t('profile:languageDescription')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <LanguageSelector variant="select" />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {activeSection === 'currency' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {t('profile:currencySettings')}
                </Typography>
                <Card sx={{ mb: 3 }}>
                  <CardHeader title={t('profile:selectCurrency')} />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t('profile:currencyDescription')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <CurrencySelector variant="select" />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {activeSection === 'notifications' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">{t('profile:notifications')}</Typography>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleNotificationSettingsUpdate}
                    variant="contained"
                  >
                    {t('common:actions.save')}
                  </Button>
                </Box>

                <Card sx={{ mb: 3 }}>
                  <CardHeader title={t('profile:emailNotifications')} />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationPreferences.emailNotifications}
                          onChange={handleNotificationChange}
                          name="emailNotifications"
                        />
                      }
                      label={t('profile:enableEmailNotifications')}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('profile:emailNotificationsDescription')}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                  <CardHeader title={t('profile:pushNotifications')} />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationPreferences.pushNotifications}
                          onChange={handleNotificationChange}
                          name="pushNotifications"
                        />
                      }
                      label={t('profile:enablePushNotifications')}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('profile:pushNotificationsDescription')}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                  <CardHeader title={t('profile:smsNotifications')} />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationPreferences.smsNotifications}
                          onChange={handleNotificationChange}
                          name="smsNotifications"
                        />
                      }
                      label={t('profile:enableSmsNotifications')}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('profile:smsNotificationsDescription')}
                    </Typography>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader title={t('profile:marketingPreferences')} />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationPreferences.marketingEmails}
                          onChange={handleNotificationChange}
                          name="marketingEmails"
                        />
                      }
                      label={t('profile:enableMarketingEmails')}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('profile:marketingEmailsDescription')}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}

            {activeSection === 'privacy' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">{t('profile:privacySettings')}</Typography>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handlePrivacySettingsUpdate}
                    variant="contained"
                  >
                    {t('common:actions.save')}
                  </Button>
                </Box>

                <Card sx={{ mb: 3 }}>
                  <CardHeader title={t('profile:profileVisibility')} />
                  <CardContent>
                    <FormControl fullWidth>
                      <InputLabel id="profile-visibility-label">{t('profile:visibilityLevel')}</InputLabel>
                      <Select
                        labelId="profile-visibility-label"
                        id="profile-visibility"
                        value={privacySettings.profileVisibility}
                        label={t('profile:visibilityLevel')}
                        name="profileVisibility"
                        onChange={handlePrivacyChange}
                      >
                        <MenuItem value="public">{t('profile:public')}</MenuItem>
                        <MenuItem value="contacts">{t('profile:contacts')}</MenuItem>
                        <MenuItem value="private">{t('profile:private')}</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {t('profile:visibilityDescription')}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                  <CardHeader title={t('profile:contactPermissions')} />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.allowContactFromOtherUsers}
                          onChange={handlePrivacyChange}
                          name="allowContactFromOtherUsers"
                        />
                      }
                      label={t('profile:allowContactFromOthers')}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('profile:contactPermissionsDescription')}
                    </Typography>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader title={t('profile:dataVisibility')} />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.showContactInfo}
                          onChange={handlePrivacyChange}
                          name="showContactInfo"
                        />
                      }
                      label={t('profile:showContactInfo')}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      {t('profile:contactInfoDescription')}
                    </Typography>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.showActivity}
                          onChange={handlePrivacyChange}
                          name="showActivity"
                        />
                      }
                      label={t('profile:showActivity')}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('profile:activityDescription')}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 