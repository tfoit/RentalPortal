import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import enhancedLogger from '../utils/enhancedLogger';

// Language options with flags
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
];

const LanguageSelector = ({ variant = 'icon' }) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  // Update current language when i18n.language changes
  useEffect(() => {
    // If the language code is complex (e.g., "en-US"), simplify it to match our options (e.g., "en")
    const simpleLang = i18n.language?.split('-')[0] || 'en';
    setCurrentLang(simpleLang);
    
    enhancedLogger.debug('Language in LanguageSelector updated', { 
      fromI18n: i18n.language, 
      simplified: simpleLang 
    });
  }, [i18n.language]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (languageCode) => {
    enhancedLogger.info('Changing language', { from: currentLang, to: languageCode });
    
    try {
      // Change language in i18n
      await i18n.changeLanguage(languageCode);
      
      // Store in localStorage
      localStorage.setItem('i18nextLng', languageCode);
      
      // Update document lang attribute
      document.documentElement.lang = languageCode;
      
      enhancedLogger.info('Language change successful', { 
        newLang: languageCode, 
        i18nLang: i18n.language,
        storedLang: localStorage.getItem('i18nextLng')
      });
    } catch (error) {
      enhancedLogger.error('Failed to change language', { 
        error: error.message, 
        languageCode 
      });
    }
    
    handleClose();
  };

  // Get current language details - with fallback if not found
  const currentLanguage = languages.find(lang => lang.code === currentLang) || 
                         languages.find(lang => lang.code === 'en') || 
                         languages[0];

  // Render icon-only variant
  if (variant === 'icon') {
    return (
      <Box>
        <Tooltip title={t('common:language.change', 'Change language')}>
          <Button
            aria-label="language-selector"
            onClick={handleClick}
            sx={{
              minWidth: 'auto',
              p: 1,
              color: 'text.secondary'
            }}
          >
            <LanguageIcon />
          </Button>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { minWidth: 150 }
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={currentLang === language.code}
              dense
            >
              <ListItemIcon sx={{ fontSize: 20, minWidth: 28 }}>
                {language.flag}
              </ListItemIcon>
              <ListItemText>{language.name}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // Render full button variant with current language
  return (
    <Box>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          display: 'flex',
          alignItems: 'center',
          textTransform: 'none'
        }}
      >
        <Box component="span" sx={{ mr: 0.5, fontSize: 18 }}>
          {currentLanguage.flag}
        </Box>
        {currentLanguage.name}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 150 }
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={currentLang === language.code}
          >
            <ListItemIcon sx={{ fontSize: 20, minWidth: 28 }}>
              {language.flag}
            </ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector; 