'use client';

import React from 'react';
import { GiraffeObservation, formatObservedOn, getDisplayName } from '@/lib/inaturalist';
import { bearingToCardinal, bearingToArrow, formatDistance } from '@/lib/geo';

interface GiraffeCardProps {
  obs: GiraffeObservation;
  rank: number;
}

export default function GiraffeCard({ obs, rank }: GiraffeCardProps) {
  const cardinal = bearingToCardinal(obs.bearing);
  const arrow = bearingToArrow(obs.bearing);
  const name = getDisplayName(obs);
  const lastSeen = formatObservedOn(obs.observed_on);
  const distance = formatDistance(obs.distanceFeet);

  const rankColors = ['border-amber-400', 'border-amber-300', 'border-amber-200'];
  const borderColor = rankColors[rank - 1] || rankColors[2];

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-l-4 ${borderColor} px-4 py-3 flex items-start gap-3 w-full`}
    >
      <div className="text-3xl leading-none mt-0.5">🦒</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-gray-900 text-sm truncate capitalize">
            {name}
          </span>
          <span className="text-amber-600 font-bold text-sm whitespace-nowrap shrink-0">
            {cardinal} {arrow}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">Last seen: {lastSeen}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-medium text-gray-700">{distance} away</span>
          {obs.place_guess && (
            <span className="text-xs text-gray-400 truncate ml-2 max-w-[140px]" title={obs.place_guess}>
              📍 {obs.place_guess}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
