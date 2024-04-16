import ProtectedPageProvider from '@/app/providers/ProtectedPageProvider/ProtectedPageProvider';
import { fetchTrips } from '@/lib/data';
import { DataTestIds } from '@/app/components/constants/constants';

const Trips = async () => {
  const trips = await fetchTrips();

  return (
    <ProtectedPageProvider>
      <p>Trips Page</p>
      <>
        {trips?.map((trip) => (
          <p key={trip._id} data-testid={DataTestIds.tripContainer}>
            {trip.name}
          </p>
        ))}
      </>
    </ProtectedPageProvider>
  );
};

export default Trips;
