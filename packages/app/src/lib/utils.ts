import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts a UTC ISO string from the backend to a local datetime string (YYYY-MM-DDTHH:mm) for datetime-local input
export function utcToLocalDateTime(utcString: string): string {
  const date = new Date(utcString); // Interprets utcString as UTC
  // These methods return values based on the local timezone of the system
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Converts a local datetime string (YYYY-MM-DDTHH:mm) from datetime-local input to a UTC Date object
export function localDateTimeToUTC(input: string): Date {
  // Create a Date object from the local string.
  // When a string without timezone info is passed, new Date() interprets it as local time.
  const localDate = new Date(input);
  // The Date object internally stores the time as UTC milliseconds since epoch.
  // So, localDate already represents the correct point in time in UTC internally.
  return localDate;
}