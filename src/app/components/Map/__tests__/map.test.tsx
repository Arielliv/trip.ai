import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MapDriver } from '@/app/components/Map/__tests__/Map.driver';

describe('Map', () => {
  let driver: MapDriver;

  beforeEach(() => {
    driver = new MapDriver();
  });

  it('renders correctly', () => {
    driver.created([]);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders a map and no marker', () => {
    driver.created([]);

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
    const markers = [{ id: '2', coordinates: { latitude: 3, longitude: 3 } }];

    driver.created(markers);

    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    const markersElements = screen.getAllByTestId('marker');
    expect(markersElements).toHaveLength(markers.length);
  });
});
