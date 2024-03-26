import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { DataTestIds } from '@/app/constants';
import { appDriver } from '@/app/app.driver';

jest.mock('@/lib/data', () => ({
  fetchTrips: jest.fn(),
}));

describe('Page', () => {
  let driver: appDriver;

  beforeEach(() => {
    jest.clearAllMocks();

    driver = new appDriver();
    driver.givenFetchTripsMock([]);
  });

  it('renders a heading', async () => {
    render(await Home());

    const main = screen.getByRole('main');

    expect(main).toBeInTheDocument();
  });

  it('should show one trip when there is one trip available', async () => {
    driver.givenFetchTripsMock([{ _id: '1', name: 'Sample Trip' }]);

    // Render the Home component
    render(await Home());

    // Wait for the component to update based on the mock response
    await waitFor(() => {
      // Query for elements by the test ID and assert their count
      const tripElements = screen.getAllByTestId(DataTestIds.tripContainer);
      expect(tripElements).toHaveLength(1);
    });
  });
});
