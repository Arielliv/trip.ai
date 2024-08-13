import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export const useCreateQueryString = () => {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (paramsObject: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(paramsObject).forEach(([name, value]) => {
        params.set(name, value);
      });

      return params.toString();
    },
    [searchParams],
  );

  return { createQueryString };
};
