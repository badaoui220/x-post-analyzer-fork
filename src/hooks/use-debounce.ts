import { useState, useEffect } from 'react';

/**
 * Debounces a value.
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called every time ...
    // ... useEffect executes, except the first time.
    return () => {
      clearTimeout(handler);
    };
  }, [
    // Only re-call effect if value or delay changes
    value,
    delay,
  ]);

  return debouncedValue;
}
