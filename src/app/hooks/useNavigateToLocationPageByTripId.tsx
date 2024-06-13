import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const useNavigateToLocationPageByTripId = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const navigateToLocationPageByTripId = (id?: string) => {
    if (!id) return;

    router.push('/locations?' + createQueryString('tripId', id));
  };

  return { navigateToLocationPageByTripId };
};
