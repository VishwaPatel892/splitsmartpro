import { useState, useEffect, useCallback } from 'react';

/**
 * useFetch – Generic data-fetching hook with loading, error, and refetch support.
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} deps - Dependency array that triggers a re-fetch
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { data, loading, error, refetch: execute };
}

export default useFetch;
