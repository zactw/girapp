'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { GiraffeObservation, getDisplayName, formatObservedOn, getGiraffesInBounds, MapBounds } from '@/lib/inaturalist';
import { formatDistance } from '@/lib/geo';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  userPosition: { lat: number; lng: number };
  units: 'imperial' | 'metric';
  onGiraffesLoaded?: (giraffes: GiraffeObservation[]) => void;
}

// Custom giraffe marker icon - emoji based
const giraffeIcon = new L.DivIcon({
  html: `<div style="font-size: 28px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🦒</div>`,
  className: 'giraffe-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// User location marker icon - minimal dot
const userIcon = new L.DivIcon({
  html: `<div style="width: 14px; height: 14px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>`,
  className: 'user-marker',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Component to handle map events and fetch giraffes
function MapBoundsHandler({
  userPosition,
  onGiraffesLoaded,
  onLoadingChange,
}: {
  userPosition: { lat: number; lng: number };
  onGiraffesLoaded: (giraffes: GiraffeObservation[]) => void;
  onLoadingChange: (loading: boolean) => void;
}) {
  const map = useMap();
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastBoundsRef = useRef<string>('');

  const fetchGiraffes = useCallback(async () => {
    const bounds = map.getBounds();
    const boundsKey = `${bounds.getSouth().toFixed(2)},${bounds.getWest().toFixed(2)},${bounds.getNorth().toFixed(2)},${bounds.getEast().toFixed(2)}`;

    // Skip if bounds haven't changed significantly
    if (boundsKey === lastBoundsRef.current) return;
    lastBoundsRef.current = boundsKey;

    const mapBounds: MapBounds = {
      swLat: bounds.getSouth(),
      swLng: bounds.getWest(),
      neLat: bounds.getNorth(),
      neLng: bounds.getEast(),
    };

    onLoadingChange(true);
    try {
      const giraffes = await getGiraffesInBounds(mapBounds, userPosition);
      onGiraffesLoaded(giraffes);
    } catch (err) {
      console.error('Failed to fetch giraffes:', err);
    } finally {
      onLoadingChange(false);
    }
  }, [map, userPosition, onGiraffesLoaded, onLoadingChange]);

  // Debounced fetch on map move
  const debouncedFetch = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(fetchGiraffes, 500);
  }, [fetchGiraffes]);

  useMapEvents({
    moveend: debouncedFetch,
    zoomend: debouncedFetch,
  });

  // Initial fetch
  useEffect(() => {
    const timer = setTimeout(fetchGiraffes, 100);
    return () => clearTimeout(timer);
  }, [fetchGiraffes]);

  return null;
}

export default function MapView({ userPosition, units, onGiraffesLoaded }: MapViewProps) {
  const [giraffes, setGiraffes] = useState<GiraffeObservation[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGiraffesLoaded = useCallback((newGiraffes: GiraffeObservation[]) => {
    setGiraffes(newGiraffes);
    // Pass data up to parent so compass can use it
    if (onGiraffesLoaded) {
      onGiraffesLoaded(newGiraffes);
    }
  }, [onGiraffesLoaded]);

  return (
    <div className="w-full h-[350px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">
      {loading && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-sm text-gray-600">Loading giraffes...</span>
        </div>
      )}

      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
        <span className="text-xs text-gray-600">
          🦒 {giraffes.length} giraffe{giraffes.length !== 1 ? 's' : ''} in view
        </span>
      </div>

      <MapContainer
        center={[userPosition.lat, userPosition.lng]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsHandler
          userPosition={userPosition}
          onGiraffesLoaded={handleGiraffesLoaded}
          onLoadingChange={setLoading}
        />

        {/* User marker */}
        <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center font-medium">You are here</div>
          </Popup>
        </Marker>

        {/* Giraffe markers */}
        {giraffes.map((giraffe) => (
          <Marker
            key={giraffe.id}
            position={[giraffe.position.lat, giraffe.position.lng]}
            icon={giraffeIcon}
          >
            <Popup>
              <div className="min-w-[180px]">
                {giraffe.photos[0] && (
                  <img
                    src={giraffe.photos[0].url.replace('/square.', '/small.')}
                    alt={getDisplayName(giraffe)}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                )}
                <div className="font-semibold text-gray-900 capitalize flex items-center gap-1">
                  {getDisplayName(giraffe)}
                  {giraffe.captive && (
                    <span className="text-[9px] px-1 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                      Zoo
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistance(giraffe.distanceFeet, units)} away
                </div>
                <div className="text-xs text-gray-500">
                  Last seen: {formatObservedOn(giraffe.observed_on)}
                </div>
                {giraffe.place_guess && (
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    📍 {giraffe.place_guess}
                  </div>
                )}
                {giraffe.user && (
                  <div className="text-xs text-gray-400">
                    by {giraffe.user}
                  </div>
                )}
                <a
                  href={giraffe.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-600 hover:underline mt-2 block"
                >
                  View on iNaturalist →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
