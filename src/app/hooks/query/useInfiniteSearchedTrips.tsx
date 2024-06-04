import { useInfiniteQuery } from '@tanstack/react-query';
import { TripsPaginationResponse } from '@/lib/types';
import { searchTrips } from '@/lib/operations/tripOperations';
import { Filters } from '@/app/hooks/useManageSearchQueryParams';

export const useInfiniteSearchedTrips = (filters?: Filters, limit: number = 10, enableQuery = true) => {
  return useInfiniteQuery<TripsPaginationResponse, Error>({
    queryKey: ['search-trips', filters, limit],
    initialPageParam: 0,
    enabled: !!limit && enableQuery, // This ensures the query only runs when an ID is provided
    retry: false, // Optional: Whether to retry failed requests
    staleTime: 1000,
    placeholderData: undefined, // Optional: Provides initial data before the query completes
    // @ts-ignore
    queryFn: ({ pageParam }) => searchTrips(filters, pageParam, limit),
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
