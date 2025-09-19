import { format } from 'date-fns';

/**
 * Checks if a date value is valid for formatting
 * @param {any} dateValue - The date value to check
 * @returns {boolean} - True if the date is valid
 */
export const isValidDate = (dateValue) => {
  if (!dateValue) return false;
  if (typeof dateValue === 'string' && dateValue.trim() === '') return false;
  
  const date = new Date(dateValue);
  return !isNaN(date.getTime()) && date.getTime() !== 0;
};

/**
 * Safely formats a date with fallback for invalid dates
 * @param {any} dateValue - The date value to format
 * @param {string} formatString - The date-fns format string
 * @param {string} fallback - Fallback text for invalid dates
 * @returns {string} - Formatted date or fallback text
 */
export const formatSafeDate = (dateValue, formatString, fallback = 'No date') => {
  if (!isValidDate(dateValue)) {
    return fallback;
  }
  
  try {
    return format(new Date(dateValue), formatString);
  } catch (error) {
    console.warn('Date formatting error:', error, 'Date value:', dateValue);
    return fallback;
  }
};

/**
 * Safely formats a date using toLocaleDateString with fallback
 * @param {any} dateValue - The date value to format
 * @param {string|object} locale - Locale string or options object
 * @param {object} options - Formatting options
 * @param {string} fallback - Fallback text for invalid dates
 * @returns {string} - Formatted date or fallback text
 */
export const formatSafeDateLocale = (dateValue, locale = 'en-US', options = {}, fallback = 'No date') => {
  if (!isValidDate(dateValue)) {
    return fallback;
  }
  
  try {
    return new Date(dateValue).toLocaleDateString(locale, options);
  } catch (error) {
    console.warn('Date locale formatting error:', error, 'Date value:', dateValue);
    return fallback;
  }
};