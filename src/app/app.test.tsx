import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Home, { DataTestIds } from '../app/page';
import axios from 'axios';

// Mock axios globally
jest.mock('axios');

describe('Page', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  beforeEach(() => {
    // Mocking axios.get to return a resolved promise with a sample trip
    mockedAxios.get.mockResolvedValue({
      data: [], // Sample trip data
    });
  });

  it('renders a heading', async () => {
    render(await Home());

    const main = screen.getByRole('main');

    expect(main).toBeInTheDocument();
  });

  it('should show one trip when there is one trip available', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [{ _id: '1', name: 'Sample Trip' }], // Sample trip data
    });

    // Render the Home component
    render(await Home());

    // Wait for the component to update based on the mock response
    await waitFor(() => {
      // Query for elements by the test ID and assert their count
      const tripElements = screen.getAllByTestId('trip-container');
      expect(tripElements).toHaveLength(1);
    });
  });
});
