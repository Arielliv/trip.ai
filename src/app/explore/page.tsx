import ProtectedPageProvider from '@/app/providers/ProtectedPageProvider/ProtectedPageProvider';

export default function Page() {
  return (
    <ProtectedPageProvider>
      <p>Explore Page</p>
    </ProtectedPageProvider>
  );
}
