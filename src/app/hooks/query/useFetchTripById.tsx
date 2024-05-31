import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchTripById } from '@/lib/operations/tripOperations';
import { ITrip } from '@/models/Trip';

export const useGetFullTripById = (id?: string, enableQuery: boolean = true): UseQueryResult<ITrip | undefined> => {
  return useQuery<ITrip | undefined, Error>({
    queryKey: ['fullTrip', id],
    queryFn: () => fetchTripById(id!),
    enabled: !!id && enableQuery, // This ensures the query only runs when an ID is provided
    staleTime: 5 * 60 * 1000, // Optional: Adjusts how long the data is considered fresh (e.g., 5 minutes)
    retry: false, // Optional: Whether to retry failed requests
    placeholderData: undefined, // Optional: Provides initial data before the query completes
  });
};
