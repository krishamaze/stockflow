/**
 * API route for fetching brands
 * Supports search query and ETag caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockBrands, generateETag, simulateDelay } from '@/lib/data/mock-data';
import type { ComboboxApiResponse } from '@/lib/types/combobox';

export async function GET(request: NextRequest) {
  // Simulate network delay
  await simulateDelay(150);

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';

  // Filter brands based on search query
  let filteredBrands = mockBrands;
  if (query) {
    filteredBrands = mockBrands.filter(brand =>
      brand.name.toLowerCase().includes(query)
    );
  }

  // Convert to ComboboxOption format
  const data = filteredBrands.map(brand => ({
    value: brand.id,
    label: brand.name,
  }));

  // Generate ETag
  const etag = generateETag(data);

  // Check If-None-Match header
  const ifNoneMatch = request.headers.get('If-None-Match');
  if (ifNoneMatch === etag) {
    return new NextResponse(null, { status: 304 });
  }

  const response: ComboboxApiResponse = {
    data,
    etag,
    total: data.length,
  };

  return NextResponse.json(response, {
    headers: {
      'ETag': etag,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export async function HEAD(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';

  let filteredBrands = mockBrands;
  if (query) {
    filteredBrands = mockBrands.filter(brand =>
      brand.name.toLowerCase().includes(query)
    );
  }

  const data = filteredBrands.map(brand => ({
    value: brand.id,
    label: brand.name,
  }));

  const etag = generateETag(data);
  const ifNoneMatch = request.headers.get('If-None-Match');

  if (ifNoneMatch === etag) {
    return new NextResponse(null, { status: 304 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'ETag': etag,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

