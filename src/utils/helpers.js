// src/utils/helpers.js
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Utility for className merging with clsx
 */
export const cn = (...inputs) => {
  return clsx(inputs);
};

/**
 * Format date to Indonesian locale
 */
export const formatDate = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'dd MMMM yyyy', { locale: id });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format price to Indonesian Rupiah currency
 */
export const formatPrice = (price) => {
  // Handle null, undefined, or non-numeric values
  if (price === null || price === undefined || isNaN(Number(price))) {
    return 'Rp 0';
  }
  
  const numericPrice = Number(price);
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericPrice);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};