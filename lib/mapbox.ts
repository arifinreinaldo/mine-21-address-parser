import { GeocodeResult } from '@/types';

// Use permanent geocoding for free tier (cheaper/same as temporary)
const MAPBOX_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places-permanent';

// Simple in-memory cache to avoid duplicate API calls
const geocodeCache = new Map<string, GeocodeResult>();
const CACHE_MAX_SIZE = 10000;

function normalizeAddress(address: string): string {
  return address.toLowerCase().trim().replace(/\s+/g, ' ');
}

function getCacheKey(address: string): string {
  return normalizeAddress(address);
}

export function getCacheStats() {
  return {
    size: geocodeCache.size,
    maxSize: CACHE_MAX_SIZE,
  };
}

export function clearCache() {
  geocodeCache.clear();
}

export async function geocodeAddress(
  address: string,
  accessToken: string
): Promise<GeocodeResult> {
  const cacheKey = getCacheKey(address);
  
  // Check cache first
  const cached = geocodeCache.get(cacheKey);
  if (cached) {
    return { ...cached, _cached: true } as GeocodeResult;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    // Optimizations for free tier:
    // - limit=1: Only get best match (reduces data transfer)
    // - types=address,place: Focus on addresses and places (more relevant results)
    // - language=id: Indonesian results for ID addresses
    const url = `${MAPBOX_BASE_URL}/${encodedAddress}.json?access_token=${accessToken}&country=ID&limit=1&types=address,place,locality,neighborhood,postcode&language=id`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    let result: GeocodeResult;
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      result = {
        latitude: feature.center[1],
        longitude: feature.center[0],
        formatted_address: feature.place_name,
      };
    } else {
      result = {
        latitude: null,
        longitude: null,
        formatted_address: null,
        error: 'No results found',
      };
    }

    // Cache successful results and "no results" to avoid re-querying
    if (geocodeCache.size >= CACHE_MAX_SIZE) {
      // Remove oldest entries (first 10%)
      const keysToDelete = Array.from(geocodeCache.keys()).slice(0, CACHE_MAX_SIZE / 10);
      keysToDelete.forEach(key => geocodeCache.delete(key));
    }
    geocodeCache.set(cacheKey, result);

    return result;
  } catch (error) {
    return {
      latitude: null,
      longitude: null,
      formatted_address: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Batch geocoding - process multiple addresses efficiently
// Note: Mapbox doesn't have a true batch API, but we can optimize by deduplicating
export async function geocodeAddressBatch(
  addresses: string[],
  accessToken: string
): Promise<Map<string, GeocodeResult>> {
  const results = new Map<string, GeocodeResult>();
  const uniqueAddresses = new Map<string, string>(); // normalized -> original

  // Deduplicate and check cache
  for (const address of addresses) {
    const cacheKey = getCacheKey(address);
    const cached = geocodeCache.get(cacheKey);
    
    if (cached) {
      results.set(address, { ...cached, _cached: true } as GeocodeResult);
    } else if (!uniqueAddresses.has(cacheKey)) {
      uniqueAddresses.set(cacheKey, address);
    }
  }

  // Geocode unique addresses that weren't cached
  for (const [, originalAddress] of uniqueAddresses) {
    const result = await geocodeAddress(originalAddress, accessToken);
    results.set(originalAddress, result);
  }

  // Map results back to all original addresses (including duplicates)
  for (const address of addresses) {
    if (!results.has(address)) {
      const cacheKey = getCacheKey(address);
      const cached = geocodeCache.get(cacheKey);
      if (cached) {
        results.set(address, { ...cached, _cached: true } as GeocodeResult);
      }
    }
  }

  return results;
}
