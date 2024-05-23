import { vi } from 'vitest';
import { TripsPaginationResponse } from '@/lib/types';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Trips from '@/app/trips/page';
import { DataTestIds } from '@/app/components/constants/constants';
import { fetchTrips } from '@/lib/operations/tripOperations';

export class tripsDriver {
  async created() {
    render(await Trips());
    await act(vi.runAllTimers);
  }
  clickOnTabAt(index: number) {
    fireEvent.click(screen.getByTestId(DataTestIds.customizedTabAt('trip-tab', index)));
  }
  // Method to setup mock resolved value for fetchTrips
  givenFetchTripsMock(data: TripsPaginationResponse) {
    vi.mocked(fetchTrips).mockReturnValue(Promise.resolve(data));
  }

  // You can add more utility methods to control the behavior of fetchTrips or other mocks
}
