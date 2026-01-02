import { NextRequest, NextResponse } from 'next/server';
import { geocode } from '@/lib/geocoder';
import { GeocodingProvider } from '@/types';
import { getRequestDelay } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const { address, provider = 'locationiq' } = await request.json();

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

    // Include rate limit info in response
    return NextResponse.json({
      ...result,
      _rateLimit: {
        delay: getRequestDelay(provider as GeocodingProvider),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
