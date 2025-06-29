// Currency formatting and conversion utilities

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
];

// Mock exchange rates (in a real app, fetch from API)
export const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.91,
  GBP: 0.80,
  JPY: 149.50,
  CAD: 1.35,
  AUD: 1.54,
  CHF: 0.89,
  CNY: 7.25,
  SEK: 10.85,
  NZD: 1.65,
};

export const formatCurrency = (amount, currencyCode = 'USD') => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency ? currency.symbol : currencyCode;
  
  // Format number with appropriate decimal places
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  
  // Handle negative amounts
  const sign = amount < 0 ? '-' : '';
  
  // Special formatting for different currencies
  switch (currencyCode) {
    case 'EUR':
      return `${sign}${formattedAmount} ${symbol}`;
    case 'JPY':
      return `${sign}${symbol}${Math.round(amount).toLocaleString()}`;
    default:
      return `${sign}${symbol}${formattedAmount}`;
  }
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;
  
  return convertedAmount;
};

export const getCurrencySymbol = (currencyCode) => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  return currency ? currency.symbol : currencyCode;
};

export const getCurrencyName = (currencyCode) => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  return currency ? currency.name : currencyCode;
};

export const getExchangeRate = (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return 1;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  return toRate / fromRate;
};

export const formatExchangeRate = (fromCurrency, toCurrency, rate = null) => {
  const actualRate = rate || getExchangeRate(fromCurrency, toCurrency);
  return `1 ${fromCurrency} = ${actualRate.toFixed(4)} ${toCurrency}`;
};

export const calculateExchangeAmount = (amount, fromCurrency, toCurrency) => {
  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
  const rate = getExchangeRate(fromCurrency, toCurrency);
  
  return {
    originalAmount: amount,
    convertedAmount,
    rate,
    fromCurrency,
    toCurrency,
    formattedOriginal: formatCurrency(amount, fromCurrency),
    formattedConverted: formatCurrency(convertedAmount, toCurrency),
    formattedRate: formatExchangeRate(fromCurrency, toCurrency, rate),
  };
};

export const validateCurrencyCode = (currencyCode) => {
  return SUPPORTED_CURRENCIES.some(c => c.code === currencyCode);
};

export const parseCurrencyAmount = (amountString) => {
  // Remove currency symbols and spaces, then parse
  const cleanAmount = amountString.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleanAmount);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatCurrencyInput = (value, currencyCode) => {
  // Format input as user types
  const numericValue = parseCurrencyAmount(value);
  if (isNaN(numericValue)) return '';
  
  return formatCurrency(numericValue, currencyCode);
};