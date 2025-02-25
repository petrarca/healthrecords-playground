import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Generates a short 16-character UUID using only alphanumeric characters.
 * This is useful for creating more readable IDs while still maintaining uniqueness.
 * The ID consists of:
 * - Current timestamp in base36 (10 chars)
 * - Random string (6 chars)
 */
export const generateShortId = (): string => {
  // Get current timestamp in base36 (will be 8-10 chars)
  const timestamp = Date.now().toString(36);
  
  // Generate random string for remaining characters
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  
  // Combine and ensure exactly 16 characters
  return (timestamp + random).slice(0, 16).padEnd(16, '0');
};
