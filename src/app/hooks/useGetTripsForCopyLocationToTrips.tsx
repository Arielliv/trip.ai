import { useInfiniteTrips } from '@/app/hooks/query/useInfiniteTrips';
import { ILocationInTrip, ITrip } from '@/models/Trip';

const mapTripsToTripsWithLocationIds = (trips: ITrip[], locationId: string): string[] => {
  return trips
    .map((trip) => {
      return {
        tripId: trip._id!,
        isLocationExists:
          trip.locations.findIndex((location: ILocationInTrip) => location.location_id === locationId) !== -1,
      };
    })
    .filter((trip) => trip.isLocationExists)
    .map((trip) => trip.tripId);
};

export const useGetTripsForCopyLocationToTrips = (location?: ILocationInTrip) => {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteTrips(20);

  const trips = data?.pages.flatMap((page) => page.trips) || [];
  const tripsWithLocationIds = mapTripsToTripsWithLocationIds(trips, location?.connectedLocationData?._id || '');
  return { trips, tripsWithLocationIds, fetchNextPage, hasNextPage, isLoading };
};
