import { fetchLocations, LocationPaginationResponse } from '@/lib/data';
import { vi } from 'vitest';
import { act, render } from '@testing-library/react';
import SavedLocations from '@/app/components/SavedLocations/SavedLocations';
import React from 'react';

export class SavedLocationsDriver {
  async created() {
    render(<SavedLocations />);
    await act(vi.runAllTimers);
  }
  // Method to setup mock resolved value for fetchTrips
  givenFetchLocationMock(data: LocationPaginationResponse) {
    vi.mocked(fetchLocations).mockResolvedValue(data);
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
