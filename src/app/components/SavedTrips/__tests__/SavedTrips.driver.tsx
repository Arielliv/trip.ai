import { fetchTrips } from '@/lib/data';
import { vi } from 'vitest';
import { act, render } from '@testing-library/react';
import React from 'react';
import { TripsPaginationResponse } from '@/lib/types';
import { ITrip } from '@/models/Trip';
import { MockTripProvider } from '@/app/components/MockTripProvider';
import SavedTrips from '@/app/components/SavedTrips/SavedTrips';

export class SavedTripsDriver {
  async created(trips: Partial<ITrip>[]) {
    const value = {
      markers: [],
      mapCenter: { lat: 1, lng: 1 },
      zoom: 15,
      currentMarker: null,
      trips,
    };
    render(
      <MockTripProvider value={value}>
        <SavedTrips setSelectedTab={() => {}} />
      </MockTripProvider>,
    );
    await act(vi.runAllTimers);
  }

  // Method to setup mock resolved value for fetchTrips
  givenFetchTripsMock(data: TripsPaginationResponse) {
    vi.mocked(fetchTrips).mockReturnValue(Promise.resolve(data));
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
