# Architecture Overview

## Tech Stack
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Google Sheets API
- OpenAI API

## Deployment
- Vercel

## Backend Data Sources
- Google Sheets with six sheets:
  1. Master Inventory
  2. Purchases
  3. Sales
  4. Opening Stock
  5. Serial Number Registry
  6. Warranty

## Architecture Pattern
- Serverless with API routes.

## Data Flow
1. Form submission in the frontend.
2. Validation on the client and/or API route.
3. API route processes data, triggers OpenAI categorization.
4. Data persisted to Google Sheets with AI-enhanced metadata.

## Key Decisions
- All data entry controlled by the frontend.
- AI-assisted categorization for consistent tagging.
- Dual barcode system supporting manufacturer codes with SKU fallback.
