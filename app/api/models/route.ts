/**
 * API route for fetching models
 * Supports filtering by brand and search query
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockModels, generateETag, simulateDelay } from '@/lib/data/mock-data';
import type { ComboboxApiResponse } from '@/lib/types/combobox';

export async function GET(request: NextRequest) {
  // Simulate network delay
  await simulateDelay(150);

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';
  const brandId = searchParams.get('brandId');

  // Filter models based on brand
  let filteredModels = mockModels;
  if (brandId) {
    filteredModels = mockModels.filter(model => model.brandId === brandId);
  }

  // Filter by search query
  if (query) {
    filteredModels = filteredModels.filter(model =>
      model.name.toLowerCase().includes(query)
    );
  }

  // Convert to ComboboxOption format
  const data = filteredModels.map(model => ({
    value: model.id,
    label: model.name,
    metadata: {
      brandId: model.brandId,
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
  const brandId = searchParams.get('brandId');

  let filteredModels = mockModels;
  if (brandId) {
    filteredModels = mockModels.filter(model => model.brandId === brandId);
  }

  if (query) {
    filteredModels = filteredModels.filter(model =>
      model.name.toLowerCase().includes(query)
    );
  }

  const data = filteredModels.map(model => ({
    value: model.id,
    label: model.name,
    metadata: {
      brandId: model.brandId,
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

