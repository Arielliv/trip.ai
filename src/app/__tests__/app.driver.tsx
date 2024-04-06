import { fetchTrips } from '@/lib/data';
import { ITrip } from '@/models/Trip';
import { vi } from 'vitest';

export class appDriver {
  // Method to setup mock resolved value for fetchTrips
  givenFetchTripsMock(data: ITrip[]) {
    vi.mocked(fetchTrips).mockReturnValue(Promise.resolve(data));
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
