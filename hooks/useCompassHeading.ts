'use client';

import { useState, useEffect, useCallback } from 'react';

interface CompassState {
  heading: number;
  available: boolean;
  permissionState: 'unknown' | 'granted' | 'denied' | 'requesting';
}

export function useCompassHeading(): CompassState & { requestPermission: () => void } {
  const [state, setState] = useState<CompassState>({
    heading: 0,
    available: false,
    permissionState: 'unknown',
  });

  const startListening = useCallback(() => {
    const handler = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS: webkitCompassHeading
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const webkitHeading = (event as any).webkitCompassHeading;
      if (typeof webkitHeading === 'number' && !isNaN(webkitHeading)) {
        heading = webkitHeading;
      } else if (event.alpha !== null) {
        heading = (360 - event.alpha) % 360;
      }

      if (heading !== null) {
        setState((prev) => ({
          ...prev,
          heading,
          available: true,
          permissionState: 'granted',
        }));
      }
    };

    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, []);

  const requestPermission = useCallback(async () => {
    setState((prev) => ({ ...prev, permissionState: 'requesting' }));

    // iOS 13+ requires explicit permission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === 'function') {
      try {
        const result = await DOE.requestPermission();
        if (result === 'granted') {
          startListening();
        } else {
          setState((prev) => ({ ...prev, permissionState: 'denied' }));
        }
      } catch {
        setState((prev) => ({ ...prev, permissionState: 'denied' }));
      }
    } else {
      startListening();
    }
  }, [startListening]);

  useEffect(() => {
    // Auto-start on non-iOS (no permission required)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission !== 'function') {
      return startListening();
    }
    // iOS: wait for user to tap
    setState((prev) => ({ ...prev, permissionState: 'unknown' }));
  }, [startListening]);

  return { ...state, requestPermission };
}
