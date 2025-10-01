# Setup Guide

## Required Environment Variables
Set the following environment variables (see `.env.example` for placeholders):
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `OPENAI_API_KEY`

## Google Sheets API Configuration
1. Create a Google Cloud project and enable the Google Sheets API.
2. Create a service account and download the JSON credentials.
3. Share the target Google Sheet with the service account email (`GOOGLE_CLIENT_EMAIL`).
4. Extract the `client_email` and `private_key` values and configure them as environment variables.

## OpenAI API Setup
1. Sign up for OpenAI and generate an API key.
2. Store the key in the `OPENAI_API_KEY` environment variable.

## Local Development
1. Install dependencies: `npm install` or `yarn install`.
2. Create a `.env.local` file based on `.env.example` and fill in the real values.
3. Run the development server: `npm run dev` or `yarn dev`.

## Deployment to Vercel
1. Connect the repository to Vercel.
2. Configure the environment variables in the Vercel project settings.
3. Trigger a deployment; Next.js will build and deploy automatically.
