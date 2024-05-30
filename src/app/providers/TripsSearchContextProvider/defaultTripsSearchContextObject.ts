import { SearchTripsContextObject } from '@/app/hooks/useSearchTrips';

export const defaultSearchTripsContext: SearchTripsContextObject = {
  trips: [],
  isLoading: false,
  error: null,
  loadTrips: () => {},
  hasNextPage: false,
  setPage: () => {},
};
