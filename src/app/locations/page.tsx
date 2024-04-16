import MyLocation from '@/app/components/MyLocation/MyLocation';
import ProtectedPageProvider from '@/app/providers/ProtectedPageProvider/ProtectedPageProvider';

export default function Page() {
  return (
    <ProtectedPageProvider>
      <MyLocation />
    </ProtectedPageProvider>
  );
}
