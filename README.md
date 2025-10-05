# StockFlow - Smart Inventory Management

AI-powered inventory system with a Supabase backend (PostgreSQL + Auth + Storage) designed for retail operations of any size.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-API-412991)

## Key Features
- Opening stock tracking with structured imports
- Purchase and sales logging with AI-assisted categorization
- Serial number and warranty lifecycle management
- Automatic SKU and product naming conventions
- Dual barcode support for manufacturer codes and internal SKUs
- Multi-tenant support with Row Level Security (RLS)
- Document storage for invoices, warranties, and product images

## Quick Start
1. Review [`docs/SETUP.md`](docs/SETUP.md) for environment configuration and tooling.
2. Copy `.env.example` to `.env.local` and fill in your credentials.
3. Install dependencies with `npm install` (or `yarn install`).
4. Run the development server using `npm run dev` (or `yarn dev`).
5. Visit `http://localhost:3000/demo/combobox` to see the cascading combobox demo.

## New: Cascading Autocomplete Combobox 🎉

A production-ready autocomplete component with fuzzy search, caching, and full accessibility support.

**Features:**
- ✅ Independent & cascading fields
- ✅ Fuzzy search with match highlighting
- ✅ ETag-based caching
- ✅ Full keyboard navigation
- ✅ WCAG 2.1 AA compliant

**Quick Example:**
```typescript
import { CascadingCombobox } from '@/components/ui/cascading-combobox';

<CascadingCombobox
  label="Brand"
  endpoint="/api/brands"
  value={brand}
  onChange={setBrand}
  prefetch={true}
/>
```

**Documentation:**
- [Component README](components/ui/README.md) - Quick reference
- [API Reference](docs/COMBOBOX_API.md) - Complete prop documentation
- [Usage Guide](docs/COMBOBOX_USAGE.md) - Common patterns and examples
- [Architectural Decisions](docs/COMBOBOX_DECISIONS.md) - Design rationale
- [Implementation Summary](docs/COMBOBOX_SUMMARY.md) - Project overview

**Demo:** Visit `/demo/combobox` to see it in action!

## Documentation
Comprehensive documentation lives in the [`docs/`](docs) directory:
- [`CONTEXT.md`](docs/CONTEXT.md) for business rules and goals
- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) for technical design
- [`FILE_INVENTORY.md`](docs/FILE_INVENTORY.md) for tracking project files
- [`SETUP.md`](docs/SETUP.md) for environment and deployment steps

![Dashboard Placeholder](https://via.placeholder.com/1200x675?text=StockFlow+Dashboard+Preview)
