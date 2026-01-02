'use client';

import { useState, useCallback, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import ProcessingStatus from '@/components/ProcessingStatus';
import DownloadButton from '@/components/DownloadButton';
import ProviderSelector from '@/components/ProviderSelector';
import { parseExcelFile, findAddressColumn, generateExcelFile } from '@/lib/excel';
import { AddressRow, ProcessingState, GeocodeResult, GeocodingProvider } from '@/types';

export default function Home() {
  const [data, setData] = useState<AddressRow[]>([]);
  const [addressColumn, setAddressColumn] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<AddressRow[]>([]);
  const [provider, setProvider] = useState<GeocodingProvider>('locationiq');
  const [availableProviders, setAvailableProviders] = useState<GeocodingProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    current: 0,
    total: 0,
    errors: [],
  });

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch('/api/providers');
        const data = await response.json();
        setAvailableProviders(data.providers);
        // Set default provider to first available (locationiq priority)
        if (data.providers.length > 0) {
          setProvider(data.providers[0]);
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setIsLoadingProviders(false);
      }
    }
    fetchProviders();
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    const buffer = await file.arrayBuffer();
    const parsedData = parseExcelFile(buffer);
    const foundColumn = findAddressColumn(parsedData);

    setData(parsedData);
    setAddressColumn(foundColumn);
    setProcessedData([]);
    setProcessingState({ isProcessing: false, current: 0, total: 0, errors: [] });
  }, []);

  const processAddresses = useCallback(async () => {
    if (!addressColumn || data.length === 0) return;

    const MAX_RETRIES = 3;
    const BASE_RETRY_DELAY = 1000;

    setProcessingState({
      isProcessing: true,
      current: 0,
      total: data.length,
      errors: [],
    });

    const results: AddressRow[] = [];
    const errors: string[] = [];
    let requestDelay = 550; // Default for LocationIQ

    for (let i = 0; i < data.length; i++) {
      const row = { ...data[i] };
      const address = row[addressColumn];

      if (address && typeof address === 'string') {
        let success = false;
        let retryCount = 0;

        while (!success && retryCount <= MAX_RETRIES) {
          try {
            const response = await fetch('/api/geocode', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address, provider }),
            });

            const result = await response.json();

            // Update request delay from server response
            if (result._rateLimit?.delay) {
              requestDelay = result._rateLimit.delay;
            }

            // Check if rate limited and should retry
            if (result.retryable && retryCount < MAX_RETRIES) {
              retryCount++;
              const retryDelay = BASE_RETRY_DELAY * Math.pow(2, retryCount);
              console.log(`Rate limited, retrying in ${retryDelay}ms (attempt ${retryCount}/${MAX_RETRIES})`);
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              continue;
            }

            row.latitude = result.latitude ?? undefined;
            row.longitude = result.longitude ?? undefined;
            row.formatted_address = result.formatted_address ?? undefined;
            row.status = result.error || 'Success';

            if (result.error) {
              errors.push(`Row ${i + 1}: ${result.error}`);
            }
            success = true;
          } catch (error) {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              const retryDelay = BASE_RETRY_DELAY * Math.pow(2, retryCount);
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              continue;
            }
            row.status = 'Error';
            errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            success = true; // Exit retry loop
          }
        }
      } else {
        row.status = 'No address';
      }

      results.push(row);

      setProcessingState((prev) => ({
        ...prev,
        current: i + 1,
        errors: [...errors],
      }));

      // Rate limiting: use provider-specific delay
      await new Promise((resolve) => setTimeout(resolve, requestDelay));
    }

    setProcessedData(results);
    setProcessingState((prev) => ({
      ...prev,
      isProcessing: false,
    }));
  }, [data, addressColumn, provider]);

  const handleDownload = useCallback(() => {
    if (processedData.length === 0) return;

    const blob = generateExcelFile(processedData);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'addresses_with_coordinates.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [processedData]);

  const isProcessing = processingState.isProcessing;
  const hasData = data.length > 0;
  const hasProcessedData = processedData.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Address Parser</h1>
          <p className="mt-2 text-gray-600">
            Upload an Excel file with addresses to get latitude and longitude coordinates
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {isLoadingProviders ? (
            <div className="mb-4 text-sm text-gray-500">Loading providers...</div>
          ) : (
            <ProviderSelector
              selected={provider}
              onChange={setProvider}
              availableProviders={availableProviders}
              isDisabled={isProcessing}
            />
          )}

          <FileUpload onFileUpload={handleFileUpload} isDisabled={isProcessing || availableProviders.length === 0} />

          <DataPreview data={data} addressColumn={addressColumn} />

          <ProcessingStatus state={processingState} provider={provider} />

          {hasData && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={processAddresses}
                disabled={isProcessing || !addressColumn || availableProviders.length === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors
                  ${
                    isProcessing || !addressColumn || availableProviders.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {isProcessing ? 'Processing...' : 'Process Addresses'}
              </button>

              <DownloadButton
                onClick={handleDownload}
                isDisabled={!hasProcessedData || isProcessing}
              />
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by {provider === 'mapbox' ? 'Mapbox' : 'LocationIQ'} Geocoding API</p>
        </div>
      </div>
    </div>
  );
}
