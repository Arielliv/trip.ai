import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Map from '@/app/components/Map/Map';
import { MockLocationProvider } from './MockLocationProvider';

describe('Map', () => {
  const focusMarker = { id: '1', lat: 0, lng: 0 };
  const value = {
    markers: [],
    mapCenter: { lat: 1, lng: 1 },
    zoom: 15,
    currentMarker: focusMarker,
  };

  it('renders correctly', () => {
    render(
      <MockLocationProvider value={value}>
        <Map />
      </MockLocationProvider>,
    );
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders a map and no marker', () => {
    render(
      <MockLocationProvider value={{ ...value, markers: [], currentMarker: undefined }}>
        <Map />
      </MockLocationProvider>,
    );

    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  it('renders a map and marker', () => {
    global.window.google = {
      maps: {
        SymbolPath: {
          // @ts-ignore
          CIRCLE: 'mock-circle',
        },
        // Mock other `google.maps` objects as needed for your tests
      },
    };
    const markers = [{ id: '2', lat: 3, lng: 3 }];
    render(
      <MockLocationProvider value={{ ...value, markers }}>
        <Map />
      </MockLocationProvider>,
    );

    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    const markersElements = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(markers.length);
  });
});
