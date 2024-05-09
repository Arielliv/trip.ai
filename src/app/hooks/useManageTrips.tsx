import { useState, useCallback } from 'react';
import { fetchTrips } from '@/lib/data';

import { ITrip } from '@/models/Trip';

export interface TripsManagerContextObject {
  trips: ITrip[];
  loadTrips: () => void;
  addTrip: (newTrip: ITrip) => void;
  isEditMode: boolean;
  loading: boolean;
  hasMore: boolean;
  removeTrip: (id: string) => void;
}

export const useManageTrips = (initialPage = 0, limit = 10) => {
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTrips = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const data = await fetchTrips(page, limit);
      setHasMore(data.trips.length === data.limit);
      setPage((prev) => prev + 1);
      setTrips((prev) => [...prev, ...data.trips]);
    } catch (err) {
      // @ts-ignore
      setError(err.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, limit, loading, page]);

  const addTrip = (newTrip: ITrip) => {
    setTrips((prevTrips) => [...prevTrips, newTrip]);
  };

  const removeTrip = (id: string) => {
    // deleteTrip(id);
    const filterTrips = trips.filter((trip) => trip._id !== id);
    setTrips(filterTrips);
  };

  const getTripById = useCallback(
    (id: string | null): ITrip | undefined => {
      if (!id) return;
      return trips.find((trip) => trip._id === id);
    },
    [trips],
  );

  return { trips, loadTrips, hasMore, loading, error, addTrip, getTripById, removeTrip };
};
