import { GeocodeResult } from '@/types';

const LOCATIONIQ_BASE_URL = 'https://us1.locationiq.com/v1/search';

export async function geocodeAddress(
  address: string,
  accessToken: string
): Promise<GeocodeResult & { retryable?: boolean }> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${LOCATIONIQ_BASE_URL}?key=${accessToken}&q=${encodedAddress}&countrycodes=id&format=json&limit=1`;

    const response = await fetch(url);

    // Handle rate limiting (429) - mark as retryable
    if (response.status === 429) {
      return {
        latitude: null,
        longitude: null,
        formatted_address: null,
        error: 'Rate limit exceeded',
        retryable: true,
      };
    }

    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted_address: result.display_name,
      };
    }

    return {
      latitude: null,
      longitude: null,
      formatted_address: null,
      error: 'No results found',
    };
  } catch (error) {
    return {
      latitude: null,
      longitude: null,
      formatted_address: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
