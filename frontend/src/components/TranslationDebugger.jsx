import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Button, Divider, Alert, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import LanguageIcon from '@mui/icons-material/Language';
import LanguageSelector from './LanguageSelector';
import enhancedLogger from '../utils/enhancedLogger';

// This component helps debug i18n/translation issues
const TranslationDebugger = () => {
  const { t, i18n } = useTranslation(['common', 'profile', 'auth']);
  const [debugInfo, setDebugInfo] = useState({});
  const [loadingStatus, setLoadingStatus] = useState({ loading: false, message: '' });
  const [resources, setResources] = useState({});
  const [expandedPanel, setExpandedPanel] = useState('language');

  useEffect(() => {
    // Gather debug information about i18n
    collectDebugInfo();
    
    // Add listener for language changes
    i18n.on('languageChanged', collectDebugInfo);
    
    return () => {
      i18n.off('languageChanged', collectDebugInfo);
    };
  }, [i18n.language]);

  const collectDebugInfo = () => {
    try {
      // Basic i18n info
      const info = {
        currentLanguage: i18n.language,
        storedLanguage: localStorage.getItem('i18nextLng'),
        detectedLanguage: navigator.language || navigator.userLanguage,
        availableLanguages: i18n.options.supportedLngs,
        defaultLanguage: i18n.options.fallbackLng,
        translationFunction: typeof i18n.t === 'function' ? 'Available' : 'Not available',
        namespaces: i18n.options.ns,
        hasLoadedNamespaces: {
          common: i18n.hasLoadedNamespace('common'),
          profile: i18n.hasLoadedNamespace('profile'),
          auth: i18n.hasLoadedNamespace('auth'),
          dashboard: i18n.hasLoadedNamespace('dashboard'),
          apartments: i18n.hasLoadedNamespace('apartments')
        },
        backendLoaded: i18n.services.backendConnector ? 'Yes' : 'No',
        initialized: i18n.isInitialized ? 'Yes' : 'No',
        dataStore: Object.keys(i18n.store?.data || {})
      };
      
      // Collect resource info for current language
      const currentResources = i18n.store?.data[i18n.language] || {};
      setResources(currentResources);
      
      // Log for debugging
      enhancedLogger.debug('Translation debug info collected', info);
      
      setDebugInfo(info);
    } catch (error) {
      enhancedLogger.error('Failed to collect translation debug info', {
        error: error.message,
        stack: error.stack
      });
    }
  };

  // Force reload translations
  const reloadTranslations = async () => {
    try {
      setLoadingStatus({ loading: true, message: 'Reloading translations...' });
      await i18n.reloadResources();
      collectDebugInfo();
      setLoadingStatus({ loading: false, message: 'Translations reloaded successfully!' });
    } catch (error) {
      enhancedLogger.error('Failed to reload translations:', error);
      setLoadingStatus({ loading: false, message: `Error: ${error.message}` });
    }
  };

  // Reset language to English
  const resetToEnglish = async () => {
    try {
      setLoadingStatus({ loading: true, message: 'Switching to English...' });
      localStorage.setItem('i18nextLng', 'en');
      await i18n.changeLanguage('en');
      collectDebugInfo();
      setLoadingStatus({ loading: false, message: 'Language set to English' });
    } catch (error) {
      enhancedLogger.error('Failed to switch language:', error);
      setLoadingStatus({ loading: false, message: `Error: ${error.message}` });
    }
  };

  // Test translation from different namespaces
  const translationTests = [
    { namespace: 'common', key: 'app_name', fallback: 'App Name Missing' },
    { namespace: 'common', key: 'nav.dashboard', fallback: 'Dashboard Missing' },
    { namespace: 'profile', key: 'title', fallback: 'Profile Title Missing' },
    { namespace: 'auth', key: 'login.title', fallback: 'Login Title Missing' },
    { namespace: 'apartments', key: 'title', fallback: 'Apartments Title Missing' }
  ];

  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Paper sx={{ p: 3, mb: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Translation Debugging Tools</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This panel helps diagnose issues with translations and language switching.
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {loadingStatus.message && (
        <Alert 
          severity={loadingStatus.loading ? "info" : "success"} 
          sx={{ mb: 2 }}
          icon={loadingStatus.loading ? <CircularProgress size={20} /> : undefined}
        >
          {loadingStatus.message}
        </Alert>
      )}
      
      <Accordion 
        expanded={expandedPanel === 'language'} 
        onChange={handlePanelChange('language')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LanguageIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Current Language</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Selected in i18n: <strong>{debugInfo.currentLanguage}</strong></Typography>
          <Typography>Stored in localStorage: <strong>{debugInfo.storedLanguage}</strong></Typography>
          <Typography>Browser language: <strong>{debugInfo.detectedLanguage}</strong></Typography>
          <Typography>Default fallback: <strong>{debugInfo.defaultLanguage}</strong></Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Change Language:</Typography>
            <LanguageSelector variant="full" />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedPanel === 'tests'} 
        onChange={handlePanelChange('tests')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Translation Tests</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {translationTests.map((test, index) => (
              <ListItem key={index} divider={index < translationTests.length - 1}>
                <ListItemText
                  primary={
                    <Box>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {test.namespace}:{test.key}:
                      </Typography>
                      <Typography component="span" sx={{ ml: 1, fontWeight: 'bold' }}>
                        "{i18n.t(`${test.namespace}:${test.key}`, test.fallback)}"
                      </Typography>
                    </Box>
                  }
                  secondary={
                    !i18n.exists(`${test.namespace}:${test.key}`) ? 
                    "⚠️ Key not found in translations" : ""
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedPanel === 'config'} 
        onChange={handlePanelChange('config')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">i18n Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Available languages: <strong>{debugInfo.availableLanguages?.join(', ')}</strong></Typography>
          <Typography>Translation function: <strong>{debugInfo.translationFunction}</strong></Typography>
          <Typography>Configured namespaces: <strong>{debugInfo.namespaces?.join(', ')}</strong></Typography>
          <Typography>i18n initialized: <strong>{debugInfo.initialized}</strong></Typography>
          <Typography>Backend connector: <strong>{debugInfo.backendLoaded}</strong></Typography>
          <Typography>Languages in data store: <strong>{debugInfo.dataStore?.join(', ') || 'None'}</strong></Typography>
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Loaded Namespaces:</Typography>
          <List dense>
            {Object.entries(debugInfo.hasLoadedNamespaces || {}).map(([ns, loaded]) => (
              <ListItem key={ns} dense>
                <ListItemText 
                  primary={`${ns}: ${loaded ? '✅ Loaded' : '❌ Not loaded'}`}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedPanel === 'resources'} 
        onChange={handlePanelChange('resources')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Resource Keys</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Showing translation keys available for current language ({debugInfo.currentLanguage}):
          </Typography>
          
          {Object.keys(resources).length === 0 ? (
            <Alert severity="warning">
              No resources loaded for the current language
            </Alert>
          ) : (
            Object.entries(resources).map(([namespace, values]) => (
              <Box key={namespace} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {namespace} namespace:
                </Typography>
                <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflow: 'auto' }}>
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(values, null, 2)}
                  </pre>
                </Paper>
              </Box>
            ))
          )}
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={reloadTranslations}
          startIcon={<RefreshIcon />}
          disabled={loadingStatus.loading}
        >
          Reload Translations
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={resetToEnglish}
          startIcon={<LanguageIcon />}
          disabled={loadingStatus.loading}
        >
          Reset to English
        </Button>
      </Box>
    </Paper>
  );
};

export default TranslationDebugger; 