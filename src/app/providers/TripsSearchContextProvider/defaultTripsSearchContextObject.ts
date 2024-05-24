import { SearchTripsContextObject } from '@/app/hooks/useSearchTrips';

export const defaultSearchTripsContext: SearchTripsContextObject = {
  trips: [],
  loading: false,
  error: null,
  loadTrips: () => {},
  hasMore: false,
  searchTripsHandler: (_searchValue, _pageOverride) => Promise.resolve(),
  setPage: () => {},
};
