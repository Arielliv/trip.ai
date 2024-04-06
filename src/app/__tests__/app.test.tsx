import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { DataTestIds } from '@/app/constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { appDriver } from '@/app/__tests__/app.driver';

describe('Page', () => {
  let driver: appDriver;

  beforeEach(() => {
    driver = new appDriver();
    driver.givenFetchTripsMock([]);
  });

  it('renders a heading', async () => {
    render(await Home());

    const main = screen.getByRole('main');

    expect(main).toBeDefined();
  });

  it('should show one trip when there is one trip available', async () => {
    driver.givenFetchTripsMock([{ _id: '1', name: 'Sample Trip' } as any]);

    // Render the Home component
    render(await Home());

    // Query for elements by the test ID and assert their count
    const tripElements = screen.getAllByTestId(DataTestIds.tripContainer);
    expect(tripElements).toHaveLength(1);
  });
});
