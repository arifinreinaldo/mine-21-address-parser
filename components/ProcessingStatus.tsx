'use client';

import { ProcessingState, GeocodingProvider } from '@/types';

interface ProcessingStatusProps {
  state: ProcessingState;
  provider?: GeocodingProvider;
}

// Estimated time per request in seconds (including delay)
const TIME_PER_REQUEST: Record<GeocodingProvider, number> = {
  locationiq: 0.6,  // ~550ms delay + request time
  mapbox: 0.15,     // ~100ms delay + request time
};

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.ceil(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.ceil(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export default function ProcessingStatus({ state, provider = 'locationiq' }: ProcessingStatusProps) {
  const { isProcessing, current, total, errors } = state;

  if (!isProcessing && current === 0) return null;

  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const remaining = total - current;
  const estimatedTimeRemaining = remaining * TIME_PER_REQUEST[provider];

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          {isProcessing ? 'Processing addresses...' : 'Processing complete!'}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {current} / {total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${
            isProcessing ? 'bg-blue-600' : 'bg-green-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isProcessing && remaining > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          Estimated time remaining: {formatTime(estimatedTimeRemaining)}
        </p>
      )}
      {errors.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-red-600 font-medium">
            {errors.length} error(s) occurred:
          </p>
          <ul className="mt-1 text-xs text-red-500 list-disc list-inside max-h-24 overflow-y-auto">
            {errors.slice(0, 5).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
            {errors.length > 5 && <li>...and {errors.length - 5} more</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
