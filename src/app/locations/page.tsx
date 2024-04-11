import ProtectedPage from '@/app/components/ProtectedPage';
import Map from '@/app/components/Map/Map';
import MyLocation from '@/app/components/MyLocation/MyLocation';

export default function Page() {
  return (
    <ProtectedPage>
      <MyLocation />
    </ProtectedPage>
  );
}
