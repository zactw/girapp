'use client';

import { GiraffeObservation, getDisplayName } from '@/lib/inaturalist';
import { bearingToCardinal, formatDistance } from '@/lib/geo';
import { PinIcon, ChevronIcon } from '@/components/Icons';

interface GiraffeCardProps {
  obs: GiraffeObservation;
  rank: number;
  units?: 'imperial' | 'metric';
}

function getPhotoUrl(url: string, size: 'square' | 'small' | 'medium' = 'small'): string {
  return url.replace('/square.', `/${size}.`);
}

export default function GiraffeCard({ obs, rank, units = 'imperial' }: GiraffeCardProps) {
  const cardinal = bearingToCardinal(obs.bearing);
  const name = getDisplayName(obs);
  const distance = formatDistance(obs.distanceFeet, units);
  const photo = obs.photos[0];

  const rankColors = ['bg-amber-500', 'bg-amber-400', 'bg-amber-300'];
  const bgColor = rankColors[rank - 1] || rankColors[2];

  return (
    <a
      href={obs.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 flex items-center gap-3 w-full hover:border-gray-200 hover:shadow-sm transition-all group"
    >
      {/* Rank indicator */}
      <div className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center shrink-0`}>
        <span className="text-white text-xs font-semibold">{rank}</span>
      </div>

      {/* Photo or emoji */}
      {photo ? (
        <img
          src={getPhotoUrl(photo.url, 'small')}
          alt={name}
          className="w-12 h-12 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <span className="text-2xl">🦒</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-900 text-sm truncate capitalize">
            {name}
          </span>
          {obs.captive && (
            <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium shrink-0">
              Zoo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-gray-500">{distance}</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-amber-600 font-medium">{cardinal}</span>
        </div>
        {obs.place_guess && (
          <div className="flex items-center gap-1 mt-1 text-gray-400">
            <PinIcon size={10} />
            <span className="text-xs truncate max-w-[180px]">{obs.place_guess}</span>
          </div>
        )}
      </div>

      {/* Chevron */}
      <ChevronIcon size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors shrink-0" />
    </a>
  );
}
