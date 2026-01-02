'use client';

import { GeocodingProvider, GeocodingProviderConfig } from '@/types';

const PROVIDERS: GeocodingProviderConfig[] = [
  {
    id: 'mapbox',
    name: 'Mapbox',
    description: 'Mapbox Geocoding API',
  },
  {
    id: 'locationiq',
    name: 'LocationIQ',
    description: 'LocationIQ Geocoding API',
  },
];

interface ProviderSelectorProps {
  selected: GeocodingProvider;
  onChange: (provider: GeocodingProvider) => void;
  isDisabled?: boolean;
}

export default function ProviderSelector({
  selected,
  onChange,
  isDisabled,
}: ProviderSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Geocoding Provider
      </label>
      <div className="flex gap-3">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => onChange(provider.id)}
            disabled={isDisabled}
            className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium
              ${
                selected === provider.id
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {provider.name}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {PROVIDERS.find((p) => p.id === selected)?.description}
      </p>
    </div>
  );
}
