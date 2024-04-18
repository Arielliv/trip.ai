import { fetchLocations, LocationPaginationResponse } from '@/lib/data';
import { vi } from 'vitest';
import { act, render } from '@testing-library/react';
import React from 'react';
import { MockLocationProvider } from '../../MockLocationProvider';
import Map from '@/app/components/Map/Map';

export class MapDriver {
  async created(locations: any[]) {
    const focusMarker = { id: '1', lat: 0, lng: 0 };
    const value = {
      mapCenter: { lat: 1, lng: 1 },
      zoom: 15,
      currentMarker: null,
      locations: locations ? locations : [],
      focusMarker,
    };
    render(
      <MockLocationProvider value={value}>
        <Map />
      </MockLocationProvider>,
    );
    await act(vi.runAllTimers);
  }
  // Method to setup mock resolved value for fetchTrips
  givenFetchLocationMock(data: LocationPaginationResponse) {
    vi.mocked(fetchLocations).mockResolvedValue(data);
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
