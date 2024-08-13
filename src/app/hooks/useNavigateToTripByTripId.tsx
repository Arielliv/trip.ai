import { useRouter } from 'next/navigation';
import { useCreateQueryString } from '@/app/providers/LocationContextFormProvider/utils/createQueryString';

export const useNavigateToTripByTripId = () => {
  const router = useRouter();

  const { createQueryString } = useCreateQueryString();
  const navigateToTripeByTripId = (id?: string) => {
    if (!id) return;

    router.push('/trips?' + createQueryString({ id }));
  };

  return { navigateToTripeByTripId };
};
