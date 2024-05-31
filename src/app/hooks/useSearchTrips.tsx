import { useCallback, useState } from 'react';
import { useInfiniteSearchedTrips } from '@/app/hooks/query/useInfiniteSearchedTrips';
import { ITrip } from '@/models/Trip';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { TripsPaginationResponse } from '@/lib/types';
import debounce from 'lodash/debounce';

export interface SearchTripsContextObject {
  trips: ITrip[];
  isLoading: boolean;
  error: any;
  loadTrips: (searchValue?: string) => void;
  hasNextPage: boolean;
  setPage: (page: number) => void;
  fetchNextPage?: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<TripsPaginationResponse, unknown>, Error>>;
}

export const useSearchTrips = (limit = 10): SearchTripsContextObject => {
  const [searchValue, setSearchValue] = useState<string>();
  const { data, error, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, refetch } = useInfiniteSearchedTrips(
    searchValue,
    limit,
    true,
  );

  const trips = data?.pages.flatMap((page) => page.trips) || [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoadTrips = useCallback(
    debounce((value?: string) => {
      setSearchValue(value);
      return refetch(); // This will trigger the query again with the new search value
    }, 300),
    [],
  );

  const loadTrips = useCallback(
    (value?: string) => {
      debouncedLoadTrips(value);
      return refetch(); // This triggers a refetch when search value changes
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refetch],
  );

  const setPage = useCallback(
    (page: number) => {
      // Mock implementation as `react-query` handles the actual pagination
      // Just trigger fetchNextPage if not loading the next page yet
      if (!isFetchingNextPage) {
        // @ts-ignore
        fetchNextPage({ pageParam: page });
      }
    },
    [fetchNextPage, isFetchingNextPage],
  );

  return {
    trips,
    isLoading,
    error: error ? error.message : null,
    loadTrips,
    hasNextPage,
    setPage,
    fetchNextPage,
  };
};
