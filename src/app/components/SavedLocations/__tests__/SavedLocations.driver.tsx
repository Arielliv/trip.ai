import { vi } from 'vitest';
import { act, render } from '@testing-library/react';
import SavedLocations from '@/app/components/SavedLocations/SavedLocations';
import React from 'react';
import { MockLocationProvider } from '../../MockLocationProvider';
import { ILocation } from '@/models/Location';
import { LocationsPaginationResponse } from '@/lib/types';
import { fetchLocations } from '@/lib/operations/locationOperations';

export class SavedLocationsDriver {
  async created(locations: Partial<ILocation>[]) {
    const value = {
      markers: [],
      mapCenter: { lat: 1, lng: 1 },
      zoom: 15,
      currentMarker: null,
      locations,
    };
    render(
      <MockLocationProvider value={value}>
        <SavedLocations setSelectedTab={() => {}} />
      </MockLocationProvider>,
    );
    await act(vi.runAllTimers);
  }
  // Method to setup mock resolved value for fetchTrips
  givenFetchLocationMock(data: LocationsPaginationResponse) {
    vi.mocked(fetchLocations).mockResolvedValue(data);
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
