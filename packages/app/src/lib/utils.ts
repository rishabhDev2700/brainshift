import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function utcToLocalDateTime(utcString: string): string {
  const date = new Date(utcString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function localDateTimeToUTC(input: string): Date {
  const localDate = new Date(input);
  // Construct a new Date object using the local date components
  // This avoids timezone interpretation issues when creating the Date object
  const year = localDate.getFullYear();
  const month = localDate.getMonth();
  const day = localDate.getDate();
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();

  // Create a UTC date from the local components
  return new Date(Date.UTC(year, month, day, hours, minutes));
}