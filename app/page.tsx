'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Compass from '@/components/Compass';
import GiraffeCard from '@/components/GiraffeCard';
import SettingsPanel from '@/components/SettingsPanel';
import { SettingsIcon, RefreshIcon, CompassIcon, MapIcon } from '@/components/Icons';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useCompassHeading } from '@/hooks/useCompassHeading';
import { useSettings } from '@/hooks/useSettings';
import { GiraffeObservation, getGiraffesInBounds, getGlobalGiraffes, MapBounds } from '@/lib/inaturalist';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] rounded-2xl bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
    </div>
  ),
});

type ViewMode = 'compass' | 'map';
type LoadStage = 'geo' | 'fetching' | 'expanding' | 'done' | 'error';

export default function Home() {
  const { position, error: geoError, loading: geoLoading } = useGeolocation();
  const { heading } = useCompassHeading();
  const { settings, setSettings, isLoaded: settingsLoaded } = useSettings();

  const [giraffes, setGiraffes] = useState<GiraffeObservation[]>([]);
  const [loadStage, setLoadStage] = useState<LoadStage>('geo');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isGlobal, setIsGlobal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('compass');

  const calculateBounds = useCallback((pos: { lat: number; lng: number }): MapBounds => {
    const delta = 0.5;
    return {
      swLat: pos.lat - delta,
      swLng: pos.lng - delta,
      neLat: pos.lat + delta,
      neLng: pos.lng + delta,
    };
  }, []);

  const fetchGiraffes = useCallback(async () => {
    if (!position || !settingsLoaded) return;
    setFetchError(null);
    setLoadStage('fetching');
    setIsGlobal(false);

    try {
      const bounds = calculateBounds(position);
      let results = await getGiraffesInBounds(bounds, position);
      results = results.slice(0, settings.resultCount);

      if (results.length === 0) {
        setLoadStage('expanding');
        results = await getGlobalGiraffes(position, settings.resultCount);
        setIsGlobal(true);
      }

      setGiraffes(results);
      setLoadStage('done');
    } catch (err) {
      console.error(err);
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch giraffes');
      setLoadStage('error');
    }
  }, [position, settings.resultCount, settingsLoaded, calculateBounds]);

  useEffect(() => {
    if (geoLoading) {
      setLoadStage('geo');
      return;
    }
    if (geoError) {
      setLoadStage('error');
      setFetchError(geoError);
      return;
    }
    if (position) {
      fetchGiraffes();
    }
  }, [position, geoLoading, geoError, fetchGiraffes]);

  const isLoading = loadStage === 'geo' || loadStage === 'fetching' || loadStage === 'expanding';

  return (
    <main className="min-h-screen bg-[#fafaf9] flex flex-col items-center pb-16">
      {/* Animated Banner */}
      <div className="w-full bg-amber-500 text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8">🤍 Happy Birthday Peanut! 🥜</span>
          <span className="mx-8">🤍 Happy Birthday Peanut! 🥜</span>
          <span className="mx-8">🤍 Happy Birthday Peanut! 🥜</span>
          <span className="mx-8">🤍 Happy Birthday Peanut! 🥜</span>
        </div>
      </div>

      {/* Header */}
      <header className="w-full max-w-md px-5 pt-safe-top pt-16 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/girappicon.png" alt="" className="w-9 h-9" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                Girapp
              </h1>
              <p className="text-xs text-gray-400 font-light">
                {isGlobal && loadStage === 'done'
                  ? 'Showing nearest global sightings'
                  : loadStage === 'done'
                  ? `${giraffes.length} nearby`
                  : 'Searching...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all"
              aria-label="Settings"
            >
              <SettingsIcon size={18} />
            </button>
            <button
              onClick={fetchGiraffes}
              disabled={isLoading}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Refresh"
            >
              <RefreshIcon size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="w-full max-w-md px-5 flex flex-col items-center gap-6">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
              <span className="text-2xl animate-pulse">🦒</span>
            </div>
            <p className="text-gray-400 text-sm font-light">
              {loadStage === 'geo' && 'Getting location...'}
              {loadStage === 'fetching' && 'Finding giraffes...'}
              {loadStage === 'expanding' && 'Expanding search...'}
            </p>
          </div>
        )}

        {/* Error state */}
        {loadStage === 'error' && fetchError && (
          <div className="w-full bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-600 text-sm">{fetchError}</p>
            <button
              onClick={fetchGiraffes}
              className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* View Toggle & Content */}
        {loadStage === 'done' && (
          <>
            {/* View Mode Toggle */}
            <div className="flex p-1 bg-gray-100/80 rounded-full">
              <button
                onClick={() => setViewMode('compass')}
                className={`flex items-center gap-2 py-2 px-5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'compass'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <CompassIcon size={16} />
                Compass
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 py-2 px-5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'map'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <MapIcon size={16} />
                Map
              </button>
            </div>

            {/* Compass View */}
            {viewMode === 'compass' && giraffes.length > 0 && (
              <Compass giraffes={giraffes} heading={heading} />
            )}

            {/* Compass - No giraffes nearby */}
            {viewMode === 'compass' && giraffes.length === 0 && (
              <div className="text-center py-12">
                <span className="text-5xl opacity-30 block mb-4">🦒</span>
                <p className="text-gray-500 font-medium">No giraffes nearby</p>
                <p className="text-gray-400 text-sm mt-1 font-light">Try the map to explore</p>
              </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && position && (
              <MapView userPosition={position} units={settings.units} />
            )}

            {/* Waypoint cards - only show in compass mode */}
            {viewMode === 'compass' && giraffes.length > 0 && (
              <div className="w-full flex flex-col gap-3">
                <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                  Nearest
                </h2>
                {giraffes.map((obs, i) => (
                  <GiraffeCard key={obs.id} obs={obs} rank={i + 1} units={settings.units} />
                ))}
              </div>
            )}

            {/* Attribution */}
            <p className="text-[11px] text-gray-300 text-center pb-4 font-light">
              Data from{' '}
              <a
                href="https://www.inaturalist.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                iNaturalist
              </a>
            </p>
          </>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdate={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
