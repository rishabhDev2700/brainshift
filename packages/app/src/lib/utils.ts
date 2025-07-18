import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function localDateTimeToUTC(input: string): Date {
  const localDate = new Date(input);
  return new Date(localDate.toISOString());
}