import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a price value into a more readable format with k (thousands) and M (millions) suffixes
 * @param price - The price to format
 * @param showAED - Whether to show the AED currency prefix
 * @returns The formatted price string
 */
export const formatPrice = (price: number | string | undefined | null, showAED = true) => {
  if (!price && price !== 0) return 'Price on request';
  
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return 'Price on request';

  // Format based on the price value
  let formattedPrice;
  
  if (numPrice >= 1000000) {
    // Format as millions (M) with 2 decimal places
    formattedPrice = (numPrice / 1000000).toFixed(2) + 'M';
  } else if (numPrice >= 1000) {
    // Format as thousands (k) with 2 decimal places
    formattedPrice = (numPrice / 1000).toFixed(2) + 'k';
  } else {
    // Format as regular number
    formattedPrice = numPrice.toString();
  }
  
  // Add AED prefix if requested
  return showAED ? `AED ${formattedPrice}` : formattedPrice;
};
