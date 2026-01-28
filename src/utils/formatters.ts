
/**
 * Formats a number as currency with the specified currency code
 * @param amount The amount to format
 * @param currencyCode The ISO currency code (default: EUR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a price as currency (alias for formatCurrency)
 * @param amount The amount to format
 * @param currencyCode The ISO currency code (default: EUR)
 * @returns Formatted currency string
 */
export const formatPrice = (amount: number, currencyCode: string = 'EUR'): string => {
  return formatCurrency(amount, currencyCode);
};

/**
 * Formats a date string into a localized date format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};
