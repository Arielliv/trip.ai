import { useState, useCallback } from 'react';
import { fetchLocations } from '@/lib/data';
import { ILocation } from '@/models/Location';

export const useFetchLocations = (initialPage = 0, limit = 10) => {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLocations = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      console.log('Fetching locations...');
      const data = await fetchLocations(page, limit);
      console.log('Fetched locations:', data.locations);
      setLocations((prev) => [...prev, ...data.locations]);
      setHasMore(data.locations.length === limit);
      setPage((prev) => prev + 1);
    } catch (err) {
      // @ts-ignore
      setError(err.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, limit]);

  return { locations, loadLocations, hasMore, loading, error };
};
