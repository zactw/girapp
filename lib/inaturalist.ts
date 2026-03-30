import { LatLng, getDistanceFeet, getBearing } from './geo';

export interface GiraffeObservation {
  id: number;
  species_guess: string | null;
  taxon?: { name: string; preferred_common_name?: string };
  observed_on: string | null;
  location: string; // "lat,lng"
  place_guess: string | null;
  position: LatLng;
  distanceFeet: number;
  bearing: number;
}

interface INatObservation {
  id: number;
  species_guess: string | null;
  taxon?: { name: string; preferred_common_name?: string };
  observed_on: string | null;
  location: string | null;
  place_guess: string | null;
}

async function fetchObservations(params: Record<string, string>): Promise<INatObservation[]> {
  const qs = new URLSearchParams({
    taxon_name: 'Giraffa',
    per_page: '50',
    order: 'desc',
    order_by: 'observed_on',
    geoprivacy: 'open',
    ...params,
  });
  const url = `https://api.inaturalist.org/v1/observations?${qs}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iNaturalist API error: ${res.status}`);
  const data = await res.json();
  return data.results as INatObservation[];
}

export async function getNearbyGiraffes(
  userPos: LatLng,
  radiusKm = 5000
): Promise<GiraffeObservation[]> {
  const raw = await fetchObservations({
    lat: String(userPos.lat),
    lng: String(userPos.lng),
    radius: String(radiusKm),
  });

  return parseAndSort(raw, userPos);
}

export async function getGlobalGiraffes(userPos: LatLng): Promise<GiraffeObservation[]> {
  const raw = await fetchObservations({ per_page: '50' });
  return parseAndSort(raw, userPos);
}

function parseAndSort(raw: INatObservation[], userPos: LatLng): GiraffeObservation[] {
  const results: GiraffeObservation[] = [];
  for (const obs of raw) {
    if (!obs.location) continue;
    const parts = obs.location.split(',');
    if (parts.length < 2) continue;
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (isNaN(lat) || isNaN(lng)) continue;
    const position: LatLng = { lat, lng };
    results.push({
      id: obs.id,
      species_guess: obs.species_guess,
      taxon: obs.taxon,
      observed_on: obs.observed_on,
      location: obs.location,
      place_guess: obs.place_guess,
      position,
      distanceFeet: getDistanceFeet(userPos, position),
      bearing: getBearing(userPos, position),
    });
  }
  results.sort((a, b) => a.distanceFeet - b.distanceFeet);
  return results.slice(0, 3);
}

export function formatObservedOn(dateStr: string | null): string {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getDisplayName(obs: GiraffeObservation): string {
  return (
    obs.taxon?.preferred_common_name ||
    obs.species_guess ||
    obs.taxon?.name ||
    'Giraffe'
  );
}
