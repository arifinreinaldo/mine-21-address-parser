export interface AddressRow {
  [key: string]: string | number | undefined;
  address?: string;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
  status?: string;
}

export interface GeocodeResult {
  latitude: number | null;
  longitude: number | null;
  formatted_address: string | null;
  error?: string;
  _cached?: boolean;
}

export interface ProcessingState {
  isProcessing: boolean;
  current: number;
  total: number;
  errors: string[];
}

export type GeocodingProvider = 'mapbox' | 'locationiq';

export interface GeocodingProviderConfig {
  id: GeocodingProvider;
  name: string;
  description: string;
}
