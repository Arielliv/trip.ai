import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { defaultTripId } from '@/app/components/constants/constants';

export interface ManageTripIdQueryParamObject {
  setTripId: (tripId: string) => void;
}

export const useManageTripIdQueryParam = (loadLocations: (id?: string) => void): ManageTripIdQueryParamObject => {
  const [tripId, setTripId] = useState<string>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tripIdParam = searchParams.get('tripId');

    if (tripIdParam !== tripId) {
      setTripId(tripIdParam || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    updateQueryParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const updateQueryParams = () => {
    const queryParams = new URLSearchParams();

    if (tripId && tripId != defaultTripId) {
      queryParams.set('tripId', tripId);
    }

    const queryString = queryParams.toString();

    router.push(tripId === defaultTripId ? pathname : pathname + '?' + queryString);
    loadLocations(tripId && tripId != defaultTripId ? tripId : undefined);
  };

  const setTripIdWithUpdate = (tripId: string) => {
    setTripId(tripId != defaultTripId ? tripId : '');
  };

  return {
    setTripId: setTripIdWithUpdate,
  };
};
