import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { defaultTripId } from '@/app/components/constants/constants';

export interface ManageTripIdQueryParamObject {
  tripId?: string;
  locationId?: string;
  setTripId: (tripId: string) => void;
  setLocationId: (locationId: string) => void;
}

export const useManageTripIdQueryParam = (loadLocations: (id?: string) => void): ManageTripIdQueryParamObject => {
  const [tripId, setTripId] = useState<string>();
  const [locationId, setLocationId] = useState<string>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tripIdParam = searchParams.get('tripId');
    const locationIdParam = searchParams.get('id');

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
  }, [tripId, locationId]);

  const updateQueryParams = () => {
    const queryParams = new URLSearchParams();

    if (tripId && tripId != defaultTripId) {
      queryParams.set('tripId', tripId);
    }

    if (locationId) {
      queryParams.set('id', locationId);
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
  };

  return {
    tripId,
    locationId,
    setTripId: setTripIdWithUpdate,
    setLocationId: setLocationIdWithUpdate,
  };
};
