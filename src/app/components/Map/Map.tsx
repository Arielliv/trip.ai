// Use client directive for client-side components in Next.js
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
}

export interface MapProps {
  markers: MapMarker[];
  focusMarker?: MapMarker;
  center: { lat: number; lng: number };
  zoom: number;
}

const Map = ({ markers, center, zoom, focusMarker }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }
  }, [map]);

  return (
    <div style={{ height: '90vh', width: '100vw', position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        zoom={zoom}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        data-testid="googleMap"
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
            data-testid="marker"
          />
        ))}
        {focusMarker && <Marker position={{ lat: focusMarker.lat, lng: focusMarker.lng }} data-testid="focusMarker" />}
      </GoogleMap>
    </div>
  );
};

export default Map;
