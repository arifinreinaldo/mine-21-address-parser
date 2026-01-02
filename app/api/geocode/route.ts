import { NextRequest, NextResponse } from 'next/server';
import { geocode } from '@/lib/geocoder';
import { GeocodingProvider } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { address, provider = 'mapbox' } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const validProviders: GeocodingProvider[] = ['mapbox', 'locationiq'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: `Invalid provider. Use: ${validProviders.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await geocode(address, provider as GeocodingProvider);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
