'use client';

import { AddressRow } from '@/types';

interface DataPreviewProps {
  data: AddressRow[];
  addressColumn: string | null;
}

export default function DataPreview({ data, addressColumn }: DataPreviewProps) {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);
  const previewData = data.slice(0, 10);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">
        Data Preview ({data.length} rows)
        {addressColumn && (
          <span className="text-sm text-gray-500 ml-2">
            Address column: <span className="font-semibold text-blue-600">{addressColumn}</span>
          </span>
        )}
      </h3>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider
                    ${header === addressColumn ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td
                    key={header}
                    className={`px-4 py-2 text-sm whitespace-nowrap
                      ${header === addressColumn ? 'text-blue-800 bg-blue-50' : 'text-gray-900'}`}
                  >
                    {String(row[header] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 10 && (
        <p className="text-sm text-gray-500 mt-2">Showing first 10 of {data.length} rows</p>
      )}
    </div>
  );
}
