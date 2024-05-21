import { vi } from 'vitest';
import { fetchTrips } from '@/lib/operations/tripOperations';
import { TripsPaginationResponse } from '@/lib/types';

export class appDriver {
  // Method to setup mock resolved value for fetchTrips
  givenFetchTripsMock(data: TripsPaginationResponse) {
    vi.mocked(fetchTrips).mockReturnValue(Promise.resolve(data));
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
