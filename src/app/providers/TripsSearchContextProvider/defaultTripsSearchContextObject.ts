import { SearchTripsContextObject } from '@/app/hooks/useSearchTrips';
import { ManageSearchQueryParamsObject } from '@/app/hooks/useManageSearchQueryParams';

const searchTripsContextObject: SearchTripsContextObject = {
  trips: [],
  isLoading: false,
  error: null,
  loadSearchedTrips: () => {},
  hasNextPage: false,
  setPage: () => {},
};

const manageSearchQueryParamsObject: ManageSearchQueryParamsObject = {
  timeFilter: [],
  locationFilter: '',
  toggleTimeFilter: (_timeValue: string) => {},
  setLocationFilter: (_newLocationFilter: string) => {},
  setPriceRangeFilter: (_newPriceRange: { minPrice: number; maxPrice: number }) => {},
  clearFilters: () => {},
  setFreeTextFilter: (_newFreeTextFilter: string) => {},
  freeTextFilter: '',
  getFilters: () => {
    return {
      timeFilter: [],
      locationFilter: '',
    };
  },
};

export const defaultSearchTripsContext = {
  ...searchTripsContextObject,
  ...manageSearchQueryParamsObject,
};
