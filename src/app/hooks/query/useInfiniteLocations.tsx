import { useInfiniteQuery } from '@tanstack/react-query';
import { LocationsPaginationResponse } from '@/lib/types';
import { fetchLocations } from '@/lib/operations/locationOperations';

export const useInfiniteLocations = (tripId?: string, limit: number = 10, enableQuery = true) => {
  return useInfiniteQuery<LocationsPaginationResponse, Error>({
    queryKey: ['locations', limit],
    initialPageParam: 0,
    enabled: !!limit && enableQuery, // This ensures the query only runs when an ID is provided
    retry: false, // Optional: Whether to retry failed requests
    placeholderData: undefined, // Optional: Provides initial data before the query completes
    // @ts-ignore
    queryFn: ({ pageParam }) => fetchLocations(pageParam, limit, tripId),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages to load
      if (lastPage.locations?.length === lastPage.limit) {
        // Return the next page number
        return allPages.length;
      }
      return undefined; // No more pages to load
    },
  });
};
