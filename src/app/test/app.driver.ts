import { fetchTrips } from '@/lib/data';
import { ITrip } from '@/models/Trip';

export class appDriver {
  // Method to setup mock resolved value for fetchTrips
  givenFetchTripsMock(data: Partial<ITrip>[]) {
    (fetchTrips as jest.Mock).mockResolvedValue(data);
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
