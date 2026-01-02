'use client';

import { GeocodingProvider, GeocodingProviderConfig } from '@/types';

const PROVIDERS: GeocodingProviderConfig[] = [
  {
    id: 'locationiq',
    name: 'LocationIQ',
    description: 'LocationIQ Geocoding API',
  },
  {
    id: 'mapbox',
    name: 'Mapbox',
    description: 'Mapbox Geocoding API',
  },
];

interface ProviderSelectorProps {
  selected: GeocodingProvider;
  onChange: (provider: GeocodingProvider) => void;
  availableProviders: GeocodingProvider[];
  isDisabled?: boolean;
}

export default function ProviderSelector({
  selected,
  onChange,
  availableProviders,
  isDisabled,
}: ProviderSelectorProps) {
  const visibleProviders = PROVIDERS.filter((p) => availableProviders.includes(p.id));

  if (visibleProviders.length === 0) {
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          No geocoding providers configured. Please add API keys to your environment variables.
        </p>
      </div>
    );
  }

  if (visibleProviders.length === 1) {
    return (
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Using <span className="font-medium">{visibleProviders[0].name}</span> Geocoding API
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Geocoding Provider
      </label>
      <div className="flex gap-3">
        {visibleProviders.map((provider) => (
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
