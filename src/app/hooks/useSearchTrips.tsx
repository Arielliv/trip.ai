import { useCallback, useState, useTransition } from 'react';
import { useInfiniteSearchedTrips } from '@/app/hooks/query/useInfiniteSearchedTrips';
import { ITrip } from '@/models/Trip';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { TripsPaginationResponse } from '@/lib/types';
import { Filters } from '@/app/hooks/useManageSearchQueryParams';

export interface SearchTripsContextObject {
  trips: ITrip[];
  isLoading: boolean;
  error: any;
  loadSearchedTrips: (filters?: Filters) => void;
  hasNextPage: boolean;
  setPage: (page: number) => void;
  fetchNextPage?: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<TripsPaginationResponse, unknown>, Error>>;
  refetch: (options?: RefetchOptions) => Promise<any>;
}

export const useSearchTrips = (limit = 10): SearchTripsContextObject => {
  const [isPending, startTransition] = useTransition();
  const [filtersValue, setFiltersValue] = useState<Filters>();

  const { data, error, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, refetch } = useInfiniteSearchedTrips(
    filtersValue,
    limit,
    true,
  );

  const trips = data?.pages.flatMap((page) => page.trips) || [];

  const loadSearchedTrips = useCallback((filters?: Filters) => {
    startTransition(() => {
      setFiltersValue(filters);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPage = useCallback(
    (page: number) => {
      // Mock implementation as `react-query` handles the actual pagination
      // Just trigger fetchNextPage if not loading the next page yet
      if (!isFetchingNextPage) {
        // @ts-ignore
        void fetchNextPage({ pageParam: page });
      }
    },
    [fetchNextPage, isFetchingNextPage],
  );

  return {
    trips,
    isLoading,
    error: error ? error.message : null,
    loadSearchedTrips,
    hasNextPage,
    setPage,
    fetchNextPage,
    refetch,
  };
};
