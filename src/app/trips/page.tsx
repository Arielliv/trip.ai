import ProtectedPageProvider from '@/app/providers/ProtectedPageProvider/ProtectedPageProvider';
import { fetchTrips } from '@/lib/data';
import { DataTestIds } from '@/app/components/constants/constants';
import MyTrips from '@/app/components/MyTrips/MyTrips';

const Trips = async () => {
  return (
    <ProtectedPageProvider>
      <MyTrips />
    </ProtectedPageProvider>
  );
};

export default Trips;
