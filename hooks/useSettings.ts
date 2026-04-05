'use client';

import { useState, useEffect, useCallback } from 'react';

export type UnitSystem = 'imperial' | 'metric';

export interface Settings {
  units: UnitSystem;
  searchRadiusKm: number;
  resultCount: number;
}

const DEFAULT_SETTINGS: Settings = {
  units: 'imperial',
  searchRadiusKm: 5000,
  resultCount: 3,
};

const STORAGE_KEY = 'girapp_settings';

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettingsState({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const setSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save settings:', e);
      }
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to reset settings:', e);
    }
  }, []);

  return { settings, setSettings, resetSettings, isLoaded };
}
