import { TripsManagerContextObject } from '@/app/hooks/useManageTrips';
import { TripContextObject } from '@/app/hooks/useTripData';
import { ITrip } from '@/models/Trip';

const defaultTripContextObject: TripContextObject = {};

const defaultSavedTripsContext: TripsManagerContextObject = {
  trips: [],
  loadTrips: () => {},
  addTrip: (_newTrip: ITrip) => {},
  removeTrip: (_id: string) => {},
  isEditMode: false,
  loading: false,
  hasMore: false,
};

export const defaultTripContext = {
  ...defaultTripContextObject,
  ...defaultSavedTripsContext,
};
