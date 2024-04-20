// Use client directive for client-side components in Next.js
'use client';

import React, { useCallback, memo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { DataTestIds } from '@/app/components/constants/constants';
import { GoogleMapLoader } from '../GoogleMapLoader/GoogleMapLoader';
import { useLocationContext } from '@/app/providers/LocationContextFormProvider/LocationContextFormProvider';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
}

const markerIcon = {
  // SVG path for a pin-like marker
  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 7.5 12 7.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z',
  fillColor: '#1976d2', // Material-UI blue
  fillOpacity: 0.8,
  strokeColor: '#fff', // White stroke for visibility
  strokeWeight: 2, // Increased stroke weight for a more visible border
  scale: 2, // Scale of the icon
  // anchor: new window.google.maps.Point(12, 24), // Anchor point at the bottom center
};

const Map = () => {
  const { locations, mapCenter, zoom, currentMarker, setMap } = useLocationContext();

  const onLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
    },
    [setMap],
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, [setMap]);

  return (
    <GoogleMapLoader>
      <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={zoom}
          center={mapCenter}
          onLoad={onLoad}
          onUnmount={onUnmount}
          data-testid={DataTestIds.googleMap}
        >
          {locations.map((location, index) => (
            <Marker
              icon={markerIcon}
              key={index}
              position={{ lat: location.coordinates.latitude, lng: location.coordinates.longitude }}
              data-testid={DataTestIds.marker}
            />
          ))}
          {currentMarker && (
            <Marker
              position={{ lat: currentMarker.lat, lng: currentMarker.lng }}
              data-testid={DataTestIds.focusMarker}
            />
          )}
        </GoogleMap>
      </div>
    </GoogleMapLoader>
  );
};

export default memo(Map);
