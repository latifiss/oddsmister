// @/lib/currencyFormatter.ts
// Helper function to format currency values
export const formatCurrency = (value: string | number | undefined, currency: string = 'GHS'): string => {
  if (!value) return `${currency} 0.00`;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

// Helper function to format currency without symbol
export const formatCurrencyValue = (value: string | number | undefined, decimals: number = 2): string => {
  if (!value) return '0.00';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};