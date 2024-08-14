import ProtectedPageProvider from '@/app/providers/ProtectedPageProvider/ProtectedPageProvider';
import MyTrips from '@/app/components/MyTrips/MyTrips';
import { TripContextFormProvider } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';

const Trips = async () => {
  return (
    <ProtectedPageProvider>
      <TripContextFormProvider>
        <MyTrips />
      </TripContextFormProvider>
    </ProtectedPageProvider>
  );
};

export default Trips;
