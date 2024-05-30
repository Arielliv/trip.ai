import { useCallback } from 'react';
import { ITrip } from '@/models/Trip';
import { fetchTripById } from '@/lib/operations/tripOperations';

export const useGetFullTripById = () => {
  const getFullTripById = useCallback((id?: string): Promise<ITrip | undefined> => {
    if (!id) return Promise.resolve(undefined);
    return fetchTripById(id);
  }, []);

  return { getFullTripById };
};
