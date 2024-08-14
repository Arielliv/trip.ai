import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { defaultTripId } from '@/app/components/constants/constants';

export interface manageMyLocationsQueryParams {
  tripId?: string;
  locationId?: string;
  setTripId: (tripId: string) => void;
  setLocationId: (locationId: string) => void;
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
}

export const useManageMyLocationsQueryParams = (loadLocations: (id?: string) => void): manageMyLocationsQueryParams => {
  const [selectedTab, setSelectedTab] = useState<string>('0');
  const [tripId, setTripId] = useState<string>();
  const [locationId, setLocationId] = useState<string>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tripIdParam = searchParams.get('tripId');
    const locationIdParam = searchParams.get('id');
    const tabParam = searchParams.get('tab');

    if (tabParam !== selectedTab) {
      setSelectedTab(tabParam || '0');
    }

    if (tripIdParam !== tripId) {
      setTripId(tripIdParam || '');
    }
    if (locationIdParam !== locationId) {
      setLocationId(locationIdParam || '');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    updateQueryParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, locationId, selectedTab]);

  const updateQueryParams = () => {
    const queryParams = new URLSearchParams();

    if (tripId && tripId != defaultTripId) {
      queryParams.set('tripId', tripId);
    }

    if (locationId) {
      queryParams.set('id', locationId);
    }

    if (selectedTab) {
      queryParams.set('tab', selectedTab);
    }

    const queryString = queryParams.toString();

    if (tripId === defaultTripId) {
      queryParams.delete('tripId');
    }

    router.push(pathname + '?' + queryString);
    loadLocations(tripId && tripId != defaultTripId ? tripId : undefined);
  };

  const setTripIdWithUpdate = (tripId: string) => {
    setTripId(tripId != defaultTripId ? tripId : '');
  };

  const setLocationIdWithUpdate = (locationId: string) => {
    setLocationId(locationId);
    setSelectedTab('0');
  };

  const setSelectTabWithUpdate = (newTab: string) => {
    setSelectedTab(newTab);
  };

  return {
    tripId,
    locationId,
    setTripId: setTripIdWithUpdate,
    setLocationId: setLocationIdWithUpdate,
    setSelectedTab: setSelectTabWithUpdate,
    selectedTab,
  };
};
