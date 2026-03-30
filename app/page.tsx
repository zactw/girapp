'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Compass from '@/components/Compass';
import GiraffeCard from '@/components/GiraffeCard';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useCompassHeading } from '@/hooks/useCompassHeading';
import { GiraffeObservation, getNearbyGiraffes, getGlobalGiraffes } from '@/lib/inaturalist';

type LoadStage = 'geo' | 'fetching' | 'expanding' | 'done' | 'error';

export default function Home() {
  const { position, error: geoError, loading: geoLoading } = useGeolocation();
  const { heading, available: compassAvailable, requestPermission } = useCompassHeading();

  const [giraffes, setGiraffes] = useState<GiraffeObservation[]>([]);
  const [loadStage, setLoadStage] = useState<LoadStage>('geo');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isGlobal, setIsGlobal] = useState(false);

  const fetchGiraffes = useCallback(async () => {
    if (!position) return;
    setFetchError(null);
    setLoadStage('fetching');
    setIsGlobal(false);

    try {
      let results = await getNearbyGiraffes(position, 5000);

      if (results.length === 0) {
        setLoadStage('expanding');
        results = await getGlobalGiraffes(position);
        setIsGlobal(true);
      }

      setGiraffes(results);
      setLoadStage('done');
    } catch (err) {
      console.error(err);
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch giraffes');
      setLoadStage('error');
    }
  }, [position]);

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

  const loadingMessage = (): React.ReactNode => {
    switch (loadStage) {
      case 'geo':
        return '📍 Getting your location...';
      case 'fetching':
        return '🦒 Finding nearby giraffes...';
      case 'expanding':
        return 'No giraffes found nearby — expanding search...';
      default:
        return null;
    }
  };

  const msg = loadingMessage();

  return (
    <main className="min-h-screen bg-[#f8f8f6] flex flex-col items-center pb-16">
      {/* Header */}
      <header className="w-full max-w-md px-4 pt-safe-top pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Girapp <span className="text-2xl">🦒</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isGlobal && loadStage === 'done'
                ? '🌍 Showing nearest global giraffes'
                : loadStage === 'done'
                ? `${giraffes.length} giraffe${giraffes.length !== 1 ? 's' : ''} found nearby`
                : 'Finding nearby giraffes...'}
            </p>
          </div>
          <button
            onClick={fetchGiraffes}
            disabled={loadStage !== 'done' && loadStage !== 'error'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span className={loadStage === 'fetching' || loadStage === 'expanding' ? 'animate-spin' : ''}>
              🔄
            </span>
            Refresh
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="w-full max-w-md px-4 flex flex-col items-center gap-6">
        {/* Loading state */}
        {msg && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl animate-pulse">
              🦒
            </div>
            <p className="text-gray-600 text-sm text-center">{msg}</p>
          </div>
        )}

        {/* Error state */}
        {loadStage === 'error' && fetchError && (
          <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600 font-medium text-sm">⚠️ {fetchError}</p>
            <button
              onClick={fetchGiraffes}
              className="mt-2 text-xs text-red-500 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Compass */}
        {loadStage === 'done' && giraffes.length > 0 && (
          <>
            <Compass
              giraffes={giraffes}
              heading={heading}
              compassAvailable={compassAvailable}
              onRequestPermission={requestPermission}
            />

            {/* Waypoint cards */}
            <div className="w-full flex flex-col gap-3">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nearest Giraffes
              </h2>
              {giraffes.map((obs, i) => (
                <GiraffeCard key={obs.id} obs={obs} rank={i + 1} />
              ))}
            </div>

            {/* iNaturalist attribution */}
            <div className="text-center pb-4">
              <p className="text-xs text-gray-400">
                Data from{' '}
                <a
                  href="https://www.inaturalist.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-600"
                >
                  iNaturalist
                </a>{' '}
                · Real giraffe sightings 🌍
              </p>
            </div>
          </>
        )}

        {/* No giraffes edge case */}
        {loadStage === 'done' && giraffes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🦒</div>
            <p className="text-gray-600 font-medium">No giraffes found anywhere?!</p>
            <p className="text-gray-400 text-sm mt-1">That seems impossible. Try refreshing.</p>
          </div>
        )}
      </div>
    </main>
  );
}
