import { GeocodingProvider } from '@/types';

// Rate limits per provider (requests per second)
export const RATE_LIMITS: Record<GeocodingProvider, number> = {
  locationiq: 2,  // Free tier: 2 req/sec, 5000 req/day
  mapbox: 10,     // Free tier: 100,000 req/month
};

// Delay between requests in ms (with buffer for safety)
export const REQUEST_DELAYS: Record<GeocodingProvider, number> = {
  locationiq: 550,  // ~1.8 req/sec to stay safe under 2 req/sec
  mapbox: 100,      // 10 req/sec
};

// Max retries for rate limit errors
export const MAX_RETRIES = 3;

// Base delay for exponential backoff (ms)
export const BASE_RETRY_DELAY = 1000;

export function getRequestDelay(provider: GeocodingProvider): number {
  return REQUEST_DELAYS[provider] || 500;
}

export function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s
  return BASE_RETRY_DELAY * Math.pow(2, attempt);
}
