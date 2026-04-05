'use client';

import { Settings, UnitSystem } from '@/hooks/useSettings';
import { CloseIcon } from '@/components/Icons';

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: (settings: Partial<Settings>) => void;
  onClose: () => void;
}

const RADIUS_OPTIONS = [
  { value: 100, label: '100 km' },
  { value: 500, label: '500 km' },
  { value: 1000, label: '1,000 km' },
  { value: 5000, label: '5,000 km (default)' },
  { value: 10000, label: '10,000 km' },
];

const COUNT_OPTIONS = [1, 3, 5, 10];

export default function SettingsPanel({ settings, onUpdate, onClose }: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Units */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Distance Units
            </label>
            <div className="flex gap-2">
              {(['imperial', 'metric'] as UnitSystem[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => onUpdate({ units: unit })}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                    settings.units === unit
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {unit === 'imperial' ? 'Miles / Feet' : 'Kilometers / Meters'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Radius */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Radius
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ searchRadiusKm: opt.value })}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                    settings.searchRadiusKm === opt.value
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Giraffes
            </label>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((count) => (
                <button
                  key={count}
                  onClick={() => onUpdate({ resultCount: count })}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                    settings.resultCount === count
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
