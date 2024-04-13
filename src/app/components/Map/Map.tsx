// Use client directive for client-side components in Next.js
'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useLocationContext } from '@/app/components/MyLocation/LocationDataContext';
import { DataTestIds } from '@/app/constants';
import { GoogleMapLoader } from '../GoogleMapLoader/GoogleMapLoader';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
}

const Map = () => {
  const { markers, mapCenter, zoom, currentMarker } = useLocationContext();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

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
          {markers.map((marker) => (
            <Marker
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#0000FF',
                fillOpacity: 0.6,
                strokeColor: '#000000',
                strokeWeight: 2,
                scale: 10, // Size of the icon
              }}
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
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

export default Map;
