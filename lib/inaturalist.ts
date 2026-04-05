import { LatLng, getDistanceFeet, getBearing } from './geo';

export interface GiraffePhoto {
  id: number;
  url: string; // square.jpg - replace with medium.jpg or small.jpg for other sizes
  attribution: string;
}

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
  // Metadata
  uri: string; // Link to iNaturalist observation
  photos: GiraffePhoto[];
  user: string | null; // Observer's login name
  quality_grade: 'research' | 'needs_id' | 'casual';
  captive: boolean; // true = zoo/captive, false = wild
}

interface INatObservation {
  id: number;
  species_guess: string | null;
  taxon?: { name: string; preferred_common_name?: string };
  observed_on: string | null;
  location: string | null;
  place_guess: string | null;
  uri: string;
  photos: Array<{ id: number; url: string; attribution: string }>;
  user: { login: string } | null;
  quality_grade: 'research' | 'needs_id' | 'casual';
  captive: boolean;
  positional_accuracy: number | null; // GPS accuracy in meters
}

async function fetchObservations(params: Record<string, string>, sortByDate = true, pages = 1): Promise<INatObservation[]> {
  const baseParams: Record<string, string> = {
    taxon_name: 'Giraffa',
    per_page: '200',
    geoprivacy: 'open',
    ...params,
  };

  // Only sort by date if requested (skip for geographic searches)
  if (sortByDate) {
    baseParams.order = 'desc';
    baseParams.order_by = 'observed_on';
  }

  const allResults: INatObservation[] = [];

  for (let page = 1; page <= pages; page++) {
    const qs = new URLSearchParams({ ...baseParams, page: String(page) });
    const url = `https://api.inaturalist.org/v1/observations?${qs}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`iNaturalist API error: ${res.status}`);
    const data = await res.json();
    allResults.push(...(data.results as INatObservation[]));

    // Stop if we got fewer results than requested (no more pages)
    if (data.results.length < 200) break;
  }

  return allResults;
}

export interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export async function getGiraffesInBounds(
  bounds: MapBounds,
  userPos: LatLng
): Promise<GiraffeObservation[]> {
  // Calculate bounds size to determine how many pages to fetch
  const latSpan = bounds.neLat - bounds.swLat;
  const lngSpan = bounds.neLng - bounds.swLng;
  const boundsArea = latSpan * lngSpan;

  // Fetch more pages for larger areas (wide zoom = more giraffes to find)
  // Small area (<10 sq deg): 1 page, Medium (<100): 2 pages, Large: 3 pages
  const pages = boundsArea < 10 ? 1 : boundsArea < 100 ? 2 : 3;

  // Don't sort by date for geographic searches
  const raw = await fetchObservations({
    swlat: String(bounds.swLat),
    swlng: String(bounds.swLng),
    nelat: String(bounds.neLat),
    nelng: String(bounds.neLng),
    per_page: '200',
  }, false, pages);

  // Parse all results (no limit for map view)
  return parseAndSort(raw, userPos, raw.length);
}

export async function getNearbyGiraffes(
  userPos: LatLng,
  radiusKm = 500,
  limit = 3
): Promise<GiraffeObservation[]> {
  // Use bounding box for consistent results with map view
  const kmToDeg = (km: number) => km / 111;
  const searchRadius = Math.min(radiusKm, 500); // cap at 500km
  const latDelta = kmToDeg(searchRadius);
  const lngDelta = kmToDeg(searchRadius) / Math.cos(userPos.lat * Math.PI / 180);

  const bounds: MapBounds = {
    swLat: userPos.lat - latDelta,
    swLng: userPos.lng - lngDelta,
    neLat: userPos.lat + latDelta,
    neLng: userPos.lng + lngDelta,
  };

  // Use same function as map view for consistent results
  const allResults = await getGiraffesInBounds(bounds, userPos);

  // Return top N by distance
  if (allResults.length === 0) {
    return getGlobalGiraffes(userPos, limit);
  }

  return allResults.slice(0, limit);
}

export async function getGlobalGiraffes(userPos: LatLng, limit = 10): Promise<GiraffeObservation[]> {
  const raw = await fetchObservations({ per_page: '100' });
  return parseAndSort(raw, userPos, limit);
}

// Check if coordinates are in Africa (where wild giraffes exist)
function isInAfrica(lat: number, lng: number): boolean {
  // Rough bounding box for Africa
  return lat >= -35 && lat <= 37 && lng >= -18 && lng <= 52;
}

// Keywords that indicate a legitimate zoo/sanctuary location
// Be specific - "park" alone matches city names like "Litchfield Park"
const ZOO_KEYWORDS = [
  'zoo',
  'safari park',
  'wildlife world',
  'wildlife park',
  'wildlife center',
  'wildlife sanctuary',
  'animal kingdom',
  'animal sanctuary',
  'animal park',
  'safari',
  'nature reserve',
  'game reserve',
  'conservation center',
  'aquarium',
  'wild animal',
  'living desert',
];

function hasZooInPlaceName(placeGuess: string | null): boolean {
  if (!placeGuess) return false;
  const lower = placeGuess.toLowerCase();
  return ZOO_KEYWORDS.some(keyword => lower.includes(keyword));
}

// Validate observation quality
function isValidObservation(obs: INatObservation, lat: number, lng: number): boolean {
  // Must have at least one photo for verification
  if (!obs.photos || obs.photos.length === 0) return false;

  // Filter out observations with very poor GPS accuracy (>1km)
  if (obs.positional_accuracy && obs.positional_accuracy > 1000) {
    return false;
  }

  // In Africa - allow wild giraffes
  if (isInAfrica(lat, lng)) {
    return true;
  }

  // Outside Africa - MUST be captive AND have a zoo-like place name
  // This filters out the random scattered observations with bad location data
  if (!obs.captive) {
    return false;
  }

  // For captive observations outside Africa, require zoo in place name
  // OR very tight GPS accuracy at a known zoo location
  if (!hasZooInPlaceName(obs.place_guess)) {
    // Allow if place explicitly says "Phoenix Zoo" etc, but reject generic "Maricopa County"
    return false;
  }

  return true;
}

function parseAndSort(raw: INatObservation[], userPos: LatLng, limit = 3): GiraffeObservation[] {
  const results: GiraffeObservation[] = [];
  for (const obs of raw) {
    if (!obs.location) continue;
    const parts = obs.location.split(',');
    if (parts.length < 2) continue;
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (isNaN(lat) || isNaN(lng)) continue;

    // Apply validation heuristics
    if (!isValidObservation(obs, lat, lng)) continue;

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
      uri: obs.uri,
      photos: obs.photos.map(p => ({ id: p.id, url: p.url, attribution: p.attribution })),
      user: obs.user?.login ?? null,
      quality_grade: obs.quality_grade,
      captive: obs.captive,
    });
  }

  // Sort by distance, but prefer research-grade observations
  results.sort((a, b) => {
    // Primary: distance
    const distDiff = a.distanceFeet - b.distanceFeet;
    // Secondary: quality (research > needs_id > casual)
    const qualityOrder = { research: 0, needs_id: 1, casual: 2 };
    const qualDiff = qualityOrder[a.quality_grade] - qualityOrder[b.quality_grade];
    // Weight distance more heavily, but break ties with quality
    return distDiff + qualDiff * 1000;
  });

  return results.slice(0, limit);
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
