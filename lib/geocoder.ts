import { GeocodeResult, GeocodingProvider } from '@/types';
import { geocodeAddress as mapboxGeocode } from './mapbox';
import { geocodeAddress as locationiqGeocode } from './locationiq';

export async function geocode(
  address: string,
  provider: GeocodingProvider
): Promise<GeocodeResult> {
  switch (provider) {
    case 'mapbox': {
      const token = process.env.MAPBOX_ACCESS_TOKEN;
      if (!token) {
        return {
          latitude: null,
          longitude: null,
          formatted_address: null,
          error: 'Mapbox access token not configured',
        };
      }
      return mapboxGeocode(address, token);
    }
    case 'locationiq': {
      const token = process.env.LOCATIONIQ_ACCESS_TOKEN;
      if (!token) {
        return {
          latitude: null,
          longitude: null,
          formatted_address: null,
          error: 'LocationIQ access token not configured',
        };
      }
      return locationiqGeocode(address, token);
    }
    default:
      return {
        latitude: null,
        longitude: null,
        formatted_address: null,
        error: `Unknown provider: ${provider}`,
      };
  }
}
