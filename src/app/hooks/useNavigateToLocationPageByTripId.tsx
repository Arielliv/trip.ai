import { useRouter } from 'next/navigation';
import { useCreateQueryString } from '@/app/providers/LocationContextFormProvider/utils/createQueryString';

export const useNavigateToLocationPageByTripId = () => {
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();

  const navigateToLocationPageByTripId = (id?: string) => {
    if (!id) return;

    router.push('/locations?' + createQueryString({ tripId: id, tab: '1' }));
  };

  return { navigateToLocationPageByTripId };
};
