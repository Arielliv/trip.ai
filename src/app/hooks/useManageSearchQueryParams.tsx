import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export interface Filters {
  timeFilter: string[];
  locationFilter: string;
  priceRangeFilter?: { minPrice: number; maxPrice: number };
  freeTextFilter?: string;
}

export interface ManageSearchQueryParamsObject {
  timeFilter: string[];
  locationFilter: string;
  priceRangeFilter?: { minPrice: number; maxPrice: number };
  freeTextFilter?: string;
  toggleTimeFilter: (timeValue: string) => void;
  setLocationFilter: (newLocationFilter: string) => void;
  setPriceRangeFilter: (newPriceRange: { minPrice: number; maxPrice: number }) => void;
  clearFilters: () => void;
  setFreeTextFilter: (newFreeTextFilter: string) => void;
  getFilters: () => Filters;
}

export const useManageSearchQueryParams = (loadTrips: (filters: Filters) => void): ManageSearchQueryParamsObject => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [freeTextFilter, setFreeTextFilter] = useState<string>();
  const [timeFilter, setTimeFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [priceRangeFilter, setPriceRangeFilter] = useState<{ minPrice: number; maxPrice: number }>();

  const debouncedUpdateQueryParams = useDebouncedCallback(
    // function
    () => {
      updateQueryParams();
    },
    // delay in ms
    1000,
  );

  useEffect(() => {
    const time = searchParams.get('time');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const freeText = searchParams.get('freeText');

    setTimeFilter(time ? time.split(',').map((timeValue) => timeValue) : []);
    setLocationFilter(location || '');
    setFreeTextFilter(freeText || '');
    setPriceRangeFilter({
      minPrice: parseInt(minPrice || '0', 10),
      maxPrice: parseInt(maxPrice || '10000', 10),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    debouncedUpdateQueryParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter, locationFilter, priceRangeFilter, freeTextFilter]);

  const getFilters = (): Filters => {
    return {
      freeTextFilter,
      timeFilter,
      locationFilter,
      priceRangeFilter,
    };
  };

  const updateQueryParams = () => {
    const queryParams = new URLSearchParams();

    if (timeFilter.length > 0) {
      queryParams.set('time', timeFilter.join(','));
    }
    if (locationFilter) {
      queryParams.set('location', locationFilter);
    }
    if (freeTextFilter) {
      queryParams.set('freeText', freeTextFilter);
    }
    if (priceRangeFilter?.minPrice) {
      queryParams.set('minPrice', priceRangeFilter.minPrice.toString());
    }
    if (priceRangeFilter?.maxPrice) {
      queryParams.set('maxPrice', priceRangeFilter.maxPrice.toString());
    }

    const queryString = queryParams.toString();
    router.push(pathname + '?' + queryString);
    loadTrips(getFilters());
  };

  const clearFilters = () => {
    setTimeFilter([]);
    setLocationFilter('');
    setPriceRangeFilter(undefined);
    setFreeTextFilter('');

    router.push(pathname);
  };

  const toggleTimeFilter = (timeValue: string) => {
    setTimeFilter((prev) => {
      const currentIndex = prev.indexOf(timeValue);
      const newFilter = [...prev];
      if (currentIndex === -1) {
        newFilter.push(timeValue);
      } else {
        newFilter.splice(currentIndex, 1);
      }

      return newFilter;
    });
  };

  const setLocationFilterWithUpdate = (newLocationFilter: string) => {
    setLocationFilter(newLocationFilter);
  };

  const setPriceRangeWithUpdate = (newPriceRange: { minPrice: number; maxPrice: number }) => {
    setPriceRangeFilter(newPriceRange);
  };

  const setFreeTextFilterWithUpdate = (newFreeTextFilter: string) => {
    setFreeTextFilter(newFreeTextFilter);
  };

  return {
    timeFilter,
    locationFilter,
    priceRangeFilter,
    freeTextFilter,
    toggleTimeFilter,
    setLocationFilter: setLocationFilterWithUpdate,
    setPriceRangeFilter: setPriceRangeWithUpdate,
    clearFilters,
    setFreeTextFilter: setFreeTextFilterWithUpdate,
    getFilters,
  };
};
