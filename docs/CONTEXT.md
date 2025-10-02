# Context

## Project Goal
Generic inventory management system for retail shops with Supabase backend.

## Target Users
- Shop owners
- Warehouse managers
- Sales staff

## Key Features
- Opening stock tracking
- Purchases logging
- Sales management
- Serial number tracking
- Warranty management

## Business Rules
- All data entry via frontend forms only (no manual backend edits)
- SKU auto-generated in the format `XXX-0001-CC` where `CC` is the color code
- Product names auto-generated from Brand + Model Name + Model Number + Color
- AI categorization using OpenAI for consistency
- Barcode support for manufacturer codes with fallback to internal SKU

## Technical Infrastructure
- Backend: Supabase PostgreSQL database with Row Level Security for multi-tenant isolation
- File Storage: Supabase Storage buckets for invoice PDFs, warranty documents, product images
- Optional: Google Sheets export for backup or external reporting dashboards

## Current Phase
Initial setup focused on documentation and project structure.
