import { NextResponse } from 'next/server';
import { GeocodingProvider } from '@/types';

export async function GET() {
  const availableProviders: GeocodingProvider[] = [];

  if (process.env.LOCATIONIQ_ACCESS_TOKEN) {
    availableProviders.push('locationiq');
  }

  if (process.env.MAPBOX_ACCESS_TOKEN) {
    availableProviders.push('mapbox');
  }

  return NextResponse.json({ providers: availableProviders });
}
