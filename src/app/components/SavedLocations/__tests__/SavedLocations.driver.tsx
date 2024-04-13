import { fetchLocations, LocationPaginationResponse } from '@/lib/data';
import { vi } from 'vitest';

export class SavedLocationsDriver {
  // Method to setup mock resolved value for fetchTrips
  givenFetchLocationMock(data: LocationPaginationResponse) {
    vi.mocked(fetchLocations).mockResolvedValue(data);
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
