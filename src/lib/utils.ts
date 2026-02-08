import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date | undefined | null,
  locale: string = 'es-MX',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return 'Fecha por confirmar';
  
  const parsedDate = new Date(date);
  
  // Check if date is valid
  if (isNaN(parsedDate.getTime())) {
    return 'Fecha por confirmar';
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return parsedDate.toLocaleDateString(locale, defaultOptions);
}

export function formatTime(
  date: string | Date | undefined | null,
  locale: string = 'es-MX',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return 'Hora por confirmar';
  
  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    return 'Hora por confirmar';
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return parsedDate.toLocaleTimeString(locale, defaultOptions);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getWhatsAppShareUrl(message: string, url?: string): string {
  const fullMessage = url ? `${message} ${url}` : message;
  const encodedMessage = encodeURIComponent(fullMessage);
  return `https://wa.me/?text=${encodedMessage}`;
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function getWazeUrl(lat: number, lng: number): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Parse a date string in a timezone-safe way.
 * HTML date inputs return YYYY-MM-DD format, which when parsed as UTC
 * can show the wrong day in negative timezones (e.g., Argentina UTC-3).
 * This function appends T12:00:00 to ensure noon local time, preventing date boundary issues.
 */
export function parseDateLocal(dateString: string): Date {
  // Handle null/undefined
  if (!dateString) {
    return new Date();
  }
  // If already has time component, parse normally
  if (dateString.includes('T')) {
    return new Date(dateString);
  }
  // Append noon time to prevent timezone boundary issues
  return new Date(`${dateString}T12:00:00`);
}
