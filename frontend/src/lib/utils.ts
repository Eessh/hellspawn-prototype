import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounces a function.
 * 
 * - Formal - Ensures a function is only called after a specified period of inactivity.
 * - Simple - Wait until the user stops doing something, then act.
 * 
 * @param func function to debounce
 * @param waitFor time to wait before invoking the function in milliseconds
 * @returns debounced function
 */
export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

/**
 * Throttles a function.
 *
 * - Formal - Ensures a function is only called at most once in a specified period.
 * - Simple - Act right away, then ignore further requests until a set time has passed.
 * 
 * @param func function to throttle
 * @param waitFor time to wait before invoking the function in milliseconds
 * @returns throttled function
 */
export function throttle<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let inThrottle: boolean;

  return (...args: Parameters<F>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, waitFor);
    }
  };
}
