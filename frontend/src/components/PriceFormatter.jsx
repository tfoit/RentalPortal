import { useState } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useCurrency } from '../context/CurrencyContext';

/**
 * PriceFormatter component displays prices in the user's preferred currency
 * and optionally shows the original price in a tooltip
 * 
 * @param {Object} props Component props
 * @param {number} props.amount The price amount
 * @param {string} props.currency The currency code of the original amount (defaults to EUR)
 * @param {string} props.variant Typography variant for the price display
 * @param {boolean} props.showOriginal Whether to show the original price when converted
 * @param {Object} props.sx Additional styles for the container
 * @returns {JSX.Element}
 */
const PriceFormatter = ({ 
  amount, 
  currency = 'EUR', 
  variant = 'body1',
  showOriginal = true,
  sx = {}
}) => {
  const { formatCurrency, convertCurrency, currency: currentCurrency } = useCurrency();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (amount === undefined || amount === null) {
    return <Typography variant={variant}>—</Typography>;
  }

  // Convert amount if needed
  const convertedAmount = convertCurrency(amount, currency, currentCurrency);
  const formattedAmount = formatCurrency(convertedAmount);
  const needsConversion = currency !== currentCurrency;
  
  // If no conversion is needed or we don't want to show original
  if (!needsConversion || !showOriginal) {
    return (
      <Typography variant={variant} sx={sx}>
        {formattedAmount}
      </Typography>
    );
  }

  // Show converted price with option to see original
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', ...sx }}>
      <Typography variant={variant}>
        {formattedAmount}
      </Typography>
      <Tooltip 
        title={`Original: ${formatCurrency(amount, currency)}`}
        open={tooltipOpen}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
      >
        <IconButton 
          size="small" 
          onClick={() => setTooltipOpen(!tooltipOpen)}
          sx={{ ml: 0.5, p: 0 }}
        >
          <InfoOutlinedIcon fontSize="small" color="action" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default PriceFormatter; 