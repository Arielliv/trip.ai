import ProtectedPage from '@/app/components/ProtectedPage';
import { fetchTrips } from '@/lib/data';
import { DataTestIds } from '@/app/constants';

const Trips = async () => {
  const trips = await fetchTrips();

  return (
    <ProtectedPage>
      <p>Trips Page</p>
      <>
        {trips?.map((trip) => (
          <p key={trip._id} data-testid={DataTestIds.tripContainer}>
            {trip.name}
          </p>
        ))}
      </>
    </ProtectedPage>
  );
};

export default Trips;
