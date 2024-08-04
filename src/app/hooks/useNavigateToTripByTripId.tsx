import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const useNavigateToTripByTripId = () => {
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

  const navigateToTripeByTripId = (id?: string) => {
    if (!id) return;

    router.push('/trips?' + createQueryString('id', id));
  };

  return { navigateToTripeByTripId };
};
