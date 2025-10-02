# Architecture Overview

## Tech Stack
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- OpenAI API

## Deployment
- Vercel

## Backend Data Sources
- Supabase PostgreSQL with six tables:
  1. master_inventory
  2. purchases
  3. sales
  4. opening_stock
  5. serial_numbers
  6. warranty_claims

## Authentication
- Supabase Auth with Row Level Security (RLS) policies for multi-tenant data isolation.

## File Storage
- Supabase Storage buckets for invoice PDFs, warranty documents, and product images.

## Architecture Pattern
- Serverless with API routes.

## Data Flow
1. Form submission in the frontend.
2. Validation on the client and/or API route.
3. API route processes data, triggers OpenAI categorization.
4. Data persisted to Supabase PostgreSQL via client library with RLS enforcement and AI-enhanced metadata.

## Key Decisions
- All data entry controlled by the frontend.
- AI-assisted categorization for consistent tagging.
- Dual barcode system supporting manufacturer codes with SKU fallback.

## Optional Integrations
- Google Sheets export via scheduled sync or manual export for reporting/backup purposes.
