# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Configured Git LFS support and binary prevention guidelines for Codex contributors.

### Changed
- Expanded `.gitignore` entries to cover Next.js builds, OS files, and asset upload directories.

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
