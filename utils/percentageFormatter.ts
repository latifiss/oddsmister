// @/lib/percentageFormatter.ts
// Helper function to format percentage
export const formatPercentage = (value: number | undefined): string => {
  if (!value) return '0.00%';
  
  const formattedValue = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  return `${formattedValue}%`;
};

// Helper function to format percentage without sign
export const formatPercentageValue = (value: number | undefined, decimals: number = 2): string => {
  if (!value) return '0.00';
  
  return value.toFixed(decimals);
};

// Helper function to format percentage with color class
export const getPercentageColor = (value: number): string => {
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
};