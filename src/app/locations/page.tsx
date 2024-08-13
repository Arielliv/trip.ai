import MyLocation from '@/app/components/MyLocation/MyLocation';
import ProtectedPageProvider from '@/app/providers/ProtectedPageProvider/ProtectedPageProvider';
import { LocationContextFormProvider } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';

export default function Page() {
  return (
    <ProtectedPageProvider>
      <LocationContextFormProvider>
        <MyLocation />
      </LocationContextFormProvider>
    </ProtectedPageProvider>
  );
}
