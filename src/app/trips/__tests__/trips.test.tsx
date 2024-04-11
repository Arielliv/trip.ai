import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { DataTestIds } from '@/app/constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tripsDriver } from '@/app/trips/__tests__/app.driver';
import Trips from '@/app/trips/page';

describe('Trips', () => {
  let driver: tripsDriver;

  beforeEach(() => {
    driver = new tripsDriver();
  });

  it('should show one trip when there is one trip available', async () => {
    driver.givenFetchTripsMock([{ _id: '1', name: 'Sample Trip' } as any]);

    // Render the Home component
    render(await Trips());

    // Query for elements by the test ID and assert their count
    const tripElements = screen.getAllByTestId(DataTestIds.tripContainer);
    expect(tripElements).toHaveLength(1);
  });
});
