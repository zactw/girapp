export interface LatLng {
  lat: number;
  lng: number;
}

export function getBearing(from: LatLng, to: LatLng): number {
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

export function getDistanceFeet(from: LatLng, to: LatLng): number {
  const R = 20902231; // Earth radius in feet
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(from.lat * Math.PI / 180) *
      Math.cos(to.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(feet: number): string {
  if (feet < 1000) {
    return `${Math.round(feet)} ft`;
  }
  const miles = feet / 5280;
  if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  }
  return `${Math.round(miles)} mi`;
}

export function bearingToCardinal(bearing: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(bearing / 22.5) % 16;
  return dirs[idx];
}

export function bearingToArrow(bearing: number): string {
  const dirs = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const idx = Math.round(bearing / 45) % 8;
  return dirs[idx];
}
