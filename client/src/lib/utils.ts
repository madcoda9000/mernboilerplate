import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple CSS class names using clsx and tailwind-merge.
 *
 * @param {...ClassValue} inputs - The CSS class names to combine.
 * @returns {string} The combined CSS class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
