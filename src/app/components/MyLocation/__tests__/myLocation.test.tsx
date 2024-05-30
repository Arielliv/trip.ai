import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyLocation from '@/app/components/MyLocation/MyLocation';
import { MyLocationDataTestIds } from '@/app/components/constants/constants';
import ReactQueryProvider from '@/app/providers/ReactQueryProvider/ReactQueryProvider';

describe('MyLocation', () => {
  it('renders correctly', () => {
    render(
      <ReactQueryProvider>
        <MyLocation />
      </ReactQueryProvider>,
    );

    expect(screen.getByTestId(MyLocationDataTestIds.locationTabsContainer)).toBeInTheDocument();
    expect(screen.getByTestId(MyLocationDataTestIds.mapContainer)).toBeInTheDocument();
  });
});
