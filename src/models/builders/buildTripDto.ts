import { ILocationInTrip, ITrip, ITripDto, LocationInTrip } from '@/models/Trip';
import { ObjectId } from 'mongodb';
import Location from '@/models/Location';

export const buildTripDto = async (trip: ITrip, owner_id?: string): Promise<ITripDto> => {
  let totalCost = 0;
  let startDate: Date | undefined = undefined;
  let endDate: Date | undefined = undefined;
  let mainImageUrl: string | undefined = undefined;

  trip.locations.forEach((location, _index) => {
    if (!mainImageUrl && location.connectedLocationData?.imageUrl) {
      mainImageUrl = location.connectedLocationData.imageUrl;
    }

    if (location.cost) {
      totalCost += location.cost;
    }

    if (location.dateRange && location.dateRange.length === 2) {
      const [start, end] = location.dateRange;
      if (!startDate || start < startDate) {
        startDate = start;
      }
      if (!endDate || end > endDate) {
        endDate = end;
      }
    }
  });

  if (trip.locations.length > 0) {
    const populatedFirstLocation = await Location.findById(trip.locations[0].location_id).exec();
    if (populatedFirstLocation && populatedFirstLocation.imageUrl) {
      mainImageUrl = populatedFirstLocation.imageUrl;
    }
  }

  const locations = trip.locations.map(
    ({ location_id, id, dateRange, duration, additionalInfo, cost }: ILocationInTrip): LocationInTrip => {
      return {
        location_id: new ObjectId(location_id as string),
        id,
        dateRange,
        duration,
        additionalInfo,
        cost,
      };
    },
  );

  const totals = { ...(startDate && endDate ? { totalDateRange: [startDate, endDate] } : undefined), totalCost };

  console.log({
    ...trip,
    locations,
    mainImageUrl,
    totals,
    owner_id: new ObjectId(owner_id),
  });

  return {
    ...trip,
    locations,
    mainImageUrl,
    totals,
    owner_id: new ObjectId(owner_id),
  };
};
