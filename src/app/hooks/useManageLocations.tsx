import { useState, useCallback } from 'react';
import { fetchLocations, deleteLocation } from '@/lib/data';
import { ILocation } from '@/models/Location';

export interface LocationsManagerContextObject {
  locations: ILocation[];
  loadLocations: () => void;
  addLocation: (newLocation: ILocation) => void;
  isEditMode: boolean;
  loading: boolean;
  hasMore: boolean;
  removeLocation: (id: string) => void;
}

export const useManageLocations = (initialPage = 0, limit = 10) => {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLocations = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const data = await fetchLocations(page, limit);
      setHasMore(data.locations.length === data.limit);
      setPage((prev) => prev + 1);
      setLocations((prev) => [...prev, ...data.locations]);
    } catch (err) {
      // @ts-ignore
      setError(err.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, limit, loading, page]);

  const addLocation = (newLocation: ILocation) => {
    setLocations((prevLocations) => [...prevLocations, newLocation]);
  };

  const removeLocation = (id: string) => {
    deleteLocation(id);
    const filterLocations = locations.filter((location) => location._id !== id);
    setLocations(filterLocations);
  };

  const getLocationById = useCallback(
    (id: string | null): ILocation | undefined => {
      if (!id) return;
      return locations.find((location) => location._id === id);
    },
    [locations],
  );

  return { locations, loadLocations, hasMore, loading, error, addLocation, getLocationById, removeLocation };
};