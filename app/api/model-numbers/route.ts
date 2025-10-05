/**
 * API route for fetching model numbers
 * Supports filtering by brand, model, and search query
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockModelNumbers, generateETag, simulateDelay } from '@/lib/data/mock-data';
import type { ComboboxApiResponse } from '@/lib/types/combobox';

export async function GET(request: NextRequest) {
  // Simulate network delay
  await simulateDelay(150);

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';
  const brandId = searchParams.get('brandId');
  const modelId = searchParams.get('modelId');

  // Filter model numbers based on brand and model
  let filteredModelNumbers = mockModelNumbers;
  
  if (brandId) {
    filteredModelNumbers = filteredModelNumbers.filter(
      modelNumber => modelNumber.brandId === brandId
    );
  }

  if (modelId) {
    filteredModelNumbers = filteredModelNumbers.filter(
      modelNumber => modelNumber.modelId === modelId
    );
  }

  // Filter by search query
  if (query) {
    filteredModelNumbers = filteredModelNumbers.filter(modelNumber =>
      modelNumber.number.toLowerCase().includes(query)
    );
  }

  // Convert to ComboboxOption format
  const data = filteredModelNumbers.map(modelNumber => ({
    value: modelNumber.id,
    label: modelNumber.number,
    metadata: {
      brandId: modelNumber.brandId,
      modelId: modelNumber.modelId,
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
  const modelId = searchParams.get('modelId');

  let filteredModelNumbers = mockModelNumbers;
  
  if (brandId) {
    filteredModelNumbers = filteredModelNumbers.filter(
      modelNumber => modelNumber.brandId === brandId
    );
  }

  if (modelId) {
    filteredModelNumbers = filteredModelNumbers.filter(
      modelNumber => modelNumber.modelId === modelId
    );
  }

  if (query) {
    filteredModelNumbers = filteredModelNumbers.filter(modelNumber =>
      modelNumber.number.toLowerCase().includes(query)
    );
  }

  const data = filteredModelNumbers.map(modelNumber => ({
    value: modelNumber.id,
    label: modelNumber.number,
    metadata: {
      brandId: modelNumber.brandId,
      modelId: modelNumber.modelId,
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

