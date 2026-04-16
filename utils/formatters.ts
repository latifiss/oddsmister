// Format currency with symbol
export const formatCurrency = (value: string | number | undefined, currency: string = 'GHS'): string => {
  if (!value) return `${currency} --`;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

// Format percentage
export const formatPercentage = (value: number | undefined): string => {
  if (!value) return '--';
  
  const formattedValue = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  return `${formattedValue}%`;
};

// Format large numbers (for volume, shares)
export const formatNumber = (value: number | undefined): string => {
  if (!value) return '--';
  
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  
  return value.toLocaleString();
};

// Format date
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '--';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};