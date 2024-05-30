import { useInfiniteQuery } from '@tanstack/react-query';
import { TripsPaginationResponse } from '@/lib/types';
import { fetchTrips } from '@/lib/operations/tripOperations';

export const useInfiniteTrips = (limit: number = 10, enableQuery = true) => {
  return useInfiniteQuery<TripsPaginationResponse, Error>({
    queryKey: ['trips', limit],
    initialPageParam: 0,
    enabled: !!limit && enableQuery, // This ensures the query only runs when an ID is provided
    retry: false, // Optional: Whether to retry failed requests
    placeholderData: undefined, // Optional: Provides initial data before the query completes
    // @ts-ignore
    queryFn: ({ pageParam }) => fetchTrips(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages to load
      if (lastPage.trips.length === lastPage.limit) {
        // Return the next page number
        return allPages.length;
      }
      return undefined; // No more pages to load
    },
  });
};
