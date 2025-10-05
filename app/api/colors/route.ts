/**
 * API route for fetching colors (independent field example)
 * Supports search query and ETag caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockColors, generateETag, simulateDelay } from '@/lib/data/mock-data';
import type { ComboboxApiResponse } from '@/lib/types/combobox';

export async function GET(request: NextRequest) {
  // Simulate network delay
  await simulateDelay(100);

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';

  // Filter colors based on search query
  let filteredColors = mockColors;
  if (query) {
    filteredColors = mockColors.filter(color =>
      color.name.toLowerCase().includes(query) ||
      color.code.toLowerCase().includes(query)
    );
  }

  // Convert to ComboboxOption format
  const data = filteredColors.map(color => ({
    value: color.id,
    label: color.name,
    metadata: {
      code: color.code,
    },
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

  let filteredColors = mockColors;
  if (query) {
    filteredColors = mockColors.filter(color =>
      color.name.toLowerCase().includes(query) ||
      color.code.toLowerCase().includes(query)
    );
  }

  const data = filteredColors.map(color => ({
    value: color.id,
    label: color.name,
    metadata: {
      code: color.code,
    },
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

