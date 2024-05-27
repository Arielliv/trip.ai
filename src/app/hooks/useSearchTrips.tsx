import { useCallback, useState } from 'react';
import { searchTrips } from '@/lib/operations/tripOperations';
import { ITrip } from '@/models/Trip';

export interface SearchTripsContextObject {
  trips: ITrip[];
  loading: boolean;
  error: any;
  loadTrips: (searchValue?: string) => void;
  hasMore: boolean;
  searchTripsHandler: (searchValue?: string, pageOverride?: number) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
export const useSearchTrips = (initialPage = 0, limit = 10): SearchTripsContextObject => {
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTripsHandler = useCallback(
    async (searchValue?: string, pageOverride?: number) => {
      try {
        const response = await searchTrips(searchValue, pageOverride === 0 ? pageOverride : page, limit);
        if (response.trips) {
          setHasMore(response.trips.length === response.limit);
          setPage((prev) => prev + 1);
          setTrips(response.trips);
        }
      } catch (err) {
        // @ts-ignore
        setError(err.response?.data?.message || 'An error occurred while fetching data');
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, page],
  );

  const loadTrips = useCallback(
    async (searchValue?: string) => {
      if (!hasMore || loading) return;

      setLoading(true);
      try {
        const response = await searchTrips(searchValue, page, limit);
        if (response.trips) {
          setHasMore(response.trips.length === response.limit);
          setPage((prev) => prev + 1);
          setTrips((prev) => [...prev, ...response.trips]);
        }
      } catch (err) {
        // @ts-ignore
        setError(err.response?.data?.message || 'An error occurred while fetching data');
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [hasMore, limit, loading, page],
  );

  return { trips, loading, error, loadTrips, hasMore, searchTripsHandler, setPage };
};
