'use client';

import { ProcessingState } from '@/types';

interface ProcessingStatusProps {
  state: ProcessingState;
}

export default function ProcessingStatus({ state }: ProcessingStatusProps) {
  const { isProcessing, current, total, errors } = state;

  if (!isProcessing && current === 0) return null;

  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

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
