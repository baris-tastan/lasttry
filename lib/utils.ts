import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()                           // Convert to lowercase
    .replaceAll(' ','')    
    .replace(/[^a-zA-Z0-9]/g, '');             // Collapse multiple dashes into one
}