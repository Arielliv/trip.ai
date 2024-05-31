import { ILocationInTrip, ITrip, ITripDto, LocationInTrip } from '@/models/Trip';
import { ObjectId } from 'mongodb';
import Location from '@/models/Location';

export const buildTripToSave = async (trip: ITrip, owner_id?: string): Promise<ITrip> => {
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
    ({ location_id, id, dateRange, duration, additionalInfo, cost }: ILocationInTrip): ILocationInTrip => {
      return {
        location_id,
        id,
        dateRange,
        duration,
        additionalInfo,
        cost,
      };
    },
  );

  const totals = { ...(startDate && endDate ? { totalDateRange: [startDate, endDate] } : undefined), totalCost };

  return {
    ...trip,
    locations,
    mainImageUrl,
    totals,
    ...(owner_id ? { owner_id: new ObjectId(owner_id) } : undefined),
  };
};
