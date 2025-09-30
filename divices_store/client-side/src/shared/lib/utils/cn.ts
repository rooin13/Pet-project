/**
 * `cn` is a helper function to merge Tailwind CSS class names.
 * It handles conditional classes and automatically resolves conflicts.
 * Usage example: cn("p-2", isActive && "text-red-500")
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
