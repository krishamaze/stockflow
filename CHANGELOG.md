# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.3.0] - 2025-10-05
### Added
- **Cascading Autocomplete Combobox Component** - Production-ready autocomplete component with:
  - Independent and cascading field support
  - Fuzzy search with match highlighting using Fuse.js
  - ETag-based caching with sessionStorage persistence
  - Full keyboard navigation (Arrow keys, Enter, Escape, Tab)
  - WCAG 2.1 AA accessibility compliance
  - Debounced API calls with AbortController for request cancellation
  - Custom value creation when no matches found
  - Validation with on-blur timing
  - Loading states and error handling
- Next.js 14 project setup with App Router
- TypeScript strict mode configuration
- Tailwind CSS with custom design tokens
- Radix UI primitives for accessible components
- Mock API routes for testing (`/api/brands`, `/api/models`, `/api/model-numbers`, `/api/colors`)
- Demo page at `/demo/combobox` showcasing all features
- Debug panel for visualizing component state and cache
- Comprehensive documentation:
  - `COMBOBOX_DECISIONS.md` - Architectural decisions with trade-off analysis
  - `COMBOBOX_API.md` - Complete API reference
  - `COMBOBOX_USAGE.md` - Usage guide with common patterns
- Jest testing configuration with coverage thresholds
- Bundle analyzer for performance monitoring

### Changed
- Expanded `.gitignore` entries to cover Next.js builds, OS files, and asset upload directories.
- Consolidated `.gitattributes` LFS patterns and restored lock files to version control for reliable dependency auditing.
- Updated `.env.example` to align with Supabase setup instructions while keeping Google Sheets export optional.

## [Unreleased - Previous]
### Added
- Configured Git LFS support and binary prevention guidelines for Codex contributors.
- Documented Codex verification checklist and binary prevention reminders for future tasks.

## [0.2.0] - 2025-10-02
### Changed
- **BREAKING**: Migrated backend architecture from Google Sheets to Supabase PostgreSQL for improved performance, querying capabilities, and multi-tenant support with RLS
- Updated all documentation to reflect Supabase as primary data store
- Google Sheets demoted to optional export/backup integration only

### Added
- Supabase Authentication and Row Level Security (RLS) documentation
- Supabase Storage for file uploads (invoices, warranty documents, product images)
- Multi-tenant data isolation via RLS policies

## [0.1.0] - 2025-10-01
### Added
- Initial project documentation framework and repository setup.

> Update this file after every significant change.
