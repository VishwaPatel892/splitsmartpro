export const getCurrencyConfig = () => {
  const pref = localStorage.getItem('splitsmart_currency') || 'INR (₹)';
  if (pref.includes('USD')) return { symbol: '$', locale: 'en-US' };
  if (pref.includes('EUR')) return { symbol: '€', locale: 'de-DE' };
  if (pref.includes('GBP')) return { symbol: '£', locale: 'en-GB' };
  return { symbol: '₹', locale: 'en-IN' };
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) amount = 0;
  const { symbol, locale } = getCurrencyConfig();
  return `${symbol}${Number(amount).toLocaleString(locale)}`;
};

export const getCurrencySymbol = () => {
  return getCurrencyConfig().symbol;
};
