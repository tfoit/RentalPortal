import { createContext, useContext, useState, useEffect } from 'react';

// Default exchange rates against Euro
const DEFAULT_RATES = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.86,
  CHF: 0.96,
  PLN: 4.31,
  CZK: 25.21,
  SEK: 11.27,
  DKK: 7.46,
  NOK: 11.46
};

// Create context
const CurrencyContext = createContext();

// Hook to use the currency context
export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  // State for current currency and exchange rates
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('preferredCurrency') || 'EUR';
  });
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format currency with correct symbol and locale
  const formatCurrency = (amount, targetCurrency = currency) => {
    if (amount === undefined || amount === null) return '';
    
    const currencyOptions = {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    };

    // Map currencies to appropriate locales for formatting
    const localeMap = {
      EUR: 'de-DE',
      USD: 'en-US',
      GBP: 'en-GB',
      CHF: 'de-CH',
      PLN: 'pl-PL',
      CZK: 'cs-CZ',
      SEK: 'sv-SE',
      DKK: 'da-DK',
      NOK: 'no-NO'
    };

    return new Intl.NumberFormat(localeMap[targetCurrency] || 'en-US', currencyOptions).format(amount);
  };

  // Convert amount from one currency to another
  const convertCurrency = (amount, fromCurrency = 'EUR', toCurrency = currency) => {
    if (amount === undefined || amount === null) return 0;
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to EUR first (base currency)
    const amountInEUR = fromCurrency === 'EUR' 
      ? amount 
      : amount / exchangeRates[fromCurrency];
    
    // Then convert from EUR to target currency
    return amountInEUR * exchangeRates[toCurrency];
  };

  // Change the current currency
  const changeCurrency = (newCurrency) => {
    if (exchangeRates[newCurrency]) {
      setCurrency(newCurrency);
      localStorage.setItem('preferredCurrency', newCurrency);
    } else {
      console.error(`Currency ${newCurrency} not supported`);
    }
  };

  // Fetch current exchange rates from an API
  const fetchExchangeRates = async () => {
    // In a real app, you would connect to a currency API here
    // For example:
    // const response = await fetch(`https://api.exchangerate.host/latest?base=EUR`);
    // const data = await response.json();
    // setExchangeRates(data.rates);
    
    try {
      setLoading(true);
      // For now, we'll use our default rates with a simulated API call
      setTimeout(() => {
        setExchangeRates(DEFAULT_RATES);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError('Failed to load exchange rates');
      setLoading(false);
    }
  };

  // Load exchange rates on initial render
  useEffect(() => {
    fetchExchangeRates();
    
    // In a real app, you might refresh rates periodically
    // const interval = setInterval(fetchExchangeRates, 3600000); // Refresh hourly
    // return () => clearInterval(interval);
  }, []);

  const value = {
    currency,
    exchangeRates,
    loading,
    error,
    formatCurrency,
    convertCurrency,
    changeCurrency,
    refreshRates: fetchExchangeRates
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}; 