import ProtectedPageProvider from '@/app/providers/ProtectedPageProvider/ProtectedPageProvider';
import MyTrips from '@/app/components/MyTrips/MyTrips';

const Trips = async () => {
  return (
    <ProtectedPageProvider>
      <MyTrips />
    </ProtectedPageProvider>
  );
};

export default Trips;
