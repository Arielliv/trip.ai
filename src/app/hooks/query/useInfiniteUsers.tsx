import { useInfiniteQuery } from '@tanstack/react-query';
import { UsersPaginationResponse } from '@/lib/types';
import { fetchUsers } from '@/lib/operations/userOperations';

export const useInfiniteUsers = (limit: number = 10) => {
  return useInfiniteQuery<UsersPaginationResponse, Error>({
    queryKey: ['users', limit],
    initialPageParam: 0,
    enabled: !!limit, // This ensures the query only runs when an ID is provided
    retry: false, // Optional: Whether to retry failed requests
    placeholderData: undefined, // Optional: Provides initial data before the query completes
    // @ts-ignore
    queryFn: ({ pageParam }) => fetchUsers(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages to load
      if (lastPage.users.length === lastPage.limit) {
        // Return the next page number
        return allPages.length;
      }
      return undefined; // No more pages to load
    },
  });
};
