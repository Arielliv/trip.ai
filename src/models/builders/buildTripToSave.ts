import { ILocationInTrip, ITrip } from '@/models/Trip';
import { ObjectId } from 'mongodb';
import Location from '@/models/Location';
import { getDaysBetweenDates } from '@/app/utils/getDaysBetweenDates';
import { IUserPermission } from '@/models/shared/types';
import { TripPermissionEnum } from '@/models/enums/permissionsEnums';

export const buildTripToSave = async (trip: ITrip, owner_id: string, isUpdateMode: boolean): Promise<ITrip> => {
  let totalCost = 0;
  let startDate: Date | undefined = undefined;
  let endDate: Date | undefined = undefined;
  let totalAmountOfDays: number | undefined = undefined;
  let mainImageUrl: string | undefined = undefined;

  trip.permissions = buildTripPermission(new ObjectId(owner_id), trip.permissions, isUpdateMode);

  trip.locations.forEach((location, _index) => {
    //Todo- check if location has admin permission and decide what to do with that throw or ignore

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

      totalAmountOfDays = getDaysBetweenDates(
        new Date(startDate as unknown as string),
        new Date(endDate as unknown as string),
      );

      console.log(totalAmountOfDays);
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

  const totals = {
    ...(startDate && endDate ? { totalDateRange: [startDate, endDate] } : undefined),
    totalAmountOfDays,
    totalCost,
  };

  return {
    ...trip,
    locations,
    mainImageUrl,
    totals,
    ...(owner_id ? { owner_id: new ObjectId(owner_id) } : undefined),
  };
};

const buildTripPermission = (
  userId: ObjectId,
  tripPermission: IUserPermission[],
  isUpdateMode: boolean,
): IUserPermission[] => {
  if (!isUpdateMode) {
    const ownerPermissions = { userId: userId, permissionType: TripPermissionEnum.Admin };
    if (tripPermission) {
      tripPermission.push(ownerPermissions);
    } else {
      tripPermission = [ownerPermissions];
    }
  }
  return tripPermission;
};
