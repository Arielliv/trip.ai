import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SavedTripsDriver } from '@/app/components/SavedTrips/__tests__/SavedTrips.driver';
import { DataTestIds } from '@/app/components/constants/constants';

describe('SavedTrips', () => {
  let driver: SavedTripsDriver;

  beforeEach(() => {
    driver = new SavedTripsDriver();
  });

  it('renders trips if present in the database', async () => {
    const mockTrips = [
      { id: 1, name: 'Trip 1' },
      { id: 2, name: 'Trip 2' },
    ];

    driver.givenFetchTripsMock({
      trips: mockTrips as any,
      page: 0,
      limit: 10,
      totalCount: 2,
      totalPages: 1,
    });

    await driver.created(mockTrips);

    expect(screen.getByTestId(DataTestIds.savedTripAt(0))).toBeInTheDocument();
    expect(screen.getByTestId(DataTestIds.savedTripAt(1))).toBeInTheDocument();
    expect(await screen.findByText('Trip 2')).toBeInTheDocument();
  });

  it('does not render locations if none are present in the database', async () => {
    driver.givenFetchTripsMock({
      trips: [],
      page: 0,
      limit: 10,
      totalCount: 0,
      totalPages: 0,
    });

    await driver.created([]);

    const message = await screen.findByText('No more trips');
    expect(message).toBeInTheDocument(); // Should show end message
    expect(screen.queryByText('Trip 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Trip 2')).not.toBeInTheDocument();
  });
});
