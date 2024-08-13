import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { defaultTripId } from '@/app/components/constants/constants';

export interface manageMyTripsQueryParams {
  tripId?: string;
  setTripId: (tripId: string) => void;
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
}

export const useManageMyTripsQueryParams = (): manageMyTripsQueryParams => {
  const [selectedTab, setSelectedTab] = useState<string>('0');
  const [tripId, setTripId] = useState<string>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tripIdParam = searchParams.get('id');
    const tabParam = searchParams.get('tab');

    if (tabParam !== selectedTab) {
      setSelectedTab(tabParam || '0');
    }

    if (tripIdParam !== tripId) {
      setTripId(tripIdParam || '');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    updateQueryParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, selectedTab]);

  const updateQueryParams = () => {
    const queryParams = new URLSearchParams();

    if (tripId && tripId != defaultTripId) {
      queryParams.set('id', tripId);
    }

    if (selectedTab) {
      queryParams.set('tab', selectedTab);
    }

    const queryString = queryParams.toString();

    if (tripId === defaultTripId) {
      queryParams.delete('tripId');
    }

    router.push(pathname + '?' + queryString);
  };

  const setTripIdWithUpdate = (tripId: string) => {
    setTripId(tripId);
    setSelectedTab('0');
  };

  const setSelectTabWithUpdate = (newTab: string) => {
    setSelectedTab(newTab);
  };

  return {
    tripId,
    setTripId: setTripIdWithUpdate,
    setSelectedTab: setSelectTabWithUpdate,
    selectedTab,
  };
};
