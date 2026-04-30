import { useState, useEffect, useRef } from 'react';

/**
 * useDebounce – Delays updating the value until the user stops typing.
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in ms (default 400ms)
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
