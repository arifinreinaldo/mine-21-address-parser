import { GeocodeResult } from '@/types';

const MAPBOX_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export async function geocodeAddress(
  address: string,
  accessToken: string
): Promise<GeocodeResult> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${MAPBOX_BASE_URL}/${encodedAddress}.json?access_token=${accessToken}&country=ID&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        latitude: feature.center[1],
        longitude: feature.center[0],
        formatted_address: feature.place_name,
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
