import ProtectedPageProvider from '@/app/providers/ProtectedPageProvider/ProtectedPageProvider';
import ExploreView from '@/app/components/ExploreView/ExploreView';

export default function Page() {
  return (
    <ProtectedPageProvider>
      <ExploreView />
    </ProtectedPageProvider>
  );
}
