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

## UI Components

### Cascading Autocomplete Combobox
A production-ready autocomplete component built with Radix UI primitives and designed for reusability across all forms.

**Key Features:**
- Independent fields (e.g., Brand, Color) with no dependencies
- Cascading dependencies (e.g., Brand → Model Name → Model Number)
- Fuzzy search with Fuse.js for client-side matching
- ETag-based caching with sessionStorage for performance
- Debounced API calls (300ms default) to reduce server load
- Full keyboard navigation and WCAG 2.1 AA accessibility
- Request cancellation with AbortController
- Custom value creation support

**Architecture Decisions:**
- **State Management:** useReducer for complex state with cascading dependencies
- **Fetch Strategy:** Hybrid prefetch (small datasets) + lazy loading (large datasets)
- **Caching:** Aggressive 24-hour TTL with ETag validation
- **Search:** Client-side fuzzy search for <1000 items
- **Validation:** On-blur with real-time feedback for errors

**Performance:**
- Bundle size: ~15KB gzipped (including Radix UI and Fuse.js)
- Search response: <10ms for 500 items (client-side)
- API response: <300ms p95 (with caching)
- Cache hit rate: >70% target

**Documentation:**
- `docs/COMBOBOX_DECISIONS.md` - Architectural decisions
- `docs/COMBOBOX_API.md` - API reference
- `docs/COMBOBOX_USAGE.md` - Usage guide

**Demo:**
- `/demo/combobox` - Interactive demo with debug panel
