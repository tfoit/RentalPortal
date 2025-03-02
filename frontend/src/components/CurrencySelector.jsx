import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip
} from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCurrency } from '../context/CurrencyContext';

// List of available currencies with symbols
const currencyOptions = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' }
];

const CurrencySelector = ({ variant = 'icon' }) => {
  const { t } = useTranslation();
  const { currency, changeCurrency } = useCurrency();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCurrencyChange = (currencyCode) => {
    changeCurrency(currencyCode);
    handleClose();
  };

  // Find current currency details
  const currentCurrency = currencyOptions.find(c => c.code === currency) || currencyOptions[0];

  // Render icon-only variant
  if (variant === 'icon') {
    return (
      <Box>
        <Tooltip title={t('common:actions.change_currency', 'Change currency')}>
          <Button
            aria-label="currency-selector"
            onClick={handleClick}
            sx={{
              minWidth: 'auto',
              p: 1,
              color: 'text.secondary'
            }}
          >
            <CurrencyExchangeIcon />
          </Button>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { minWidth: 180 }
          }}
        >
          {currencyOptions.map((option) => (
            <MenuItem
              key={option.code}
              onClick={() => handleCurrencyChange(option.code)}
              selected={currency === option.code}
              dense
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {option.symbol}
                </Typography>
              </ListItemIcon>
              <ListItemText>
                {t(`common:currency.${option.code.toLowerCase()}`)}
              </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // Render full button variant
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
        <Typography variant="body1" sx={{ mr: 0.5, fontWeight: 'bold' }}>
          {currentCurrency.symbol}
        </Typography>
        {currentCurrency.code}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 180 }
        }}
      >
        {currencyOptions.map((option) => (
          <MenuItem
            key={option.code}
            onClick={() => handleCurrencyChange(option.code)}
            selected={currency === option.code}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {option.symbol}
              </Typography>
            </ListItemIcon>
            <ListItemText primary={option.code} secondary={t(`common:currency.${option.code.toLowerCase()}`)} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CurrencySelector; 