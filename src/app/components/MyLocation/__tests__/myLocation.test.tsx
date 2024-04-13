import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyLocation from '@/app/components/MyLocation/MyLocation';
import { MyLocationDataTestIds } from '@/app/constants';

describe('MyLocation', () => {
  it('renders correctly', () => {
    render(<MyLocation />);

    expect(screen.getByTestId(MyLocationDataTestIds.locationTabsContainer)).toBeInTheDocument();
    expect(screen.getByTestId(MyLocationDataTestIds.mapContainer)).toBeInTheDocument();
  });
});
