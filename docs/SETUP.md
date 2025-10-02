# Setup Guide

## Required Environment Variables
Set the following environment variables (see `.env.example` for placeholders):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only, keep secret)
- `OPENAI_API_KEY`

## Supabase Setup
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project and wait for provisioning to complete
3. Navigate to Project Settings → API
4. Copy the Project URL and paste it as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the `anon` `public` key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Copy the `service_role` key and paste it as `SUPABASE_SERVICE_ROLE_KEY` (never expose this client-side)
7. Run database migration scripts: `npm run db:migrate` (migrations to be created in Phase 1)

## OpenAI API Setup
1. Sign up for OpenAI and generate an API key.
2. Store the key in the `OPENAI_API_KEY` environment variable.

## Local Development
1. Install dependencies: `npm install` or `yarn install`.
2. Create a `.env.local` file based on `.env.example` and fill in the real values.
3. Run the development server: `npm run dev` or `yarn dev`.

## Deployment to Vercel
1. Connect the repository to Vercel.
2. Configure the Supabase and OpenAI environment variables in the Vercel project settings.
3. Trigger a deployment; Next.js will build and deploy automatically.

## Optional: Google Sheets Export
If you want to sync data to Google Sheets for backup or reporting:
1. Configure Google Sheets API credentials (see archived docs)
2. Set up a scheduled export job (integration to be documented separately)
