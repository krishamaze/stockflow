# File Inventory

Update this file whenever you add, remove, or significantly modify any file.

| File | Purpose | Last Updated Reason |
| --- | --- | --- |
| `AGENT.md` | Guidance for AI contributors working on StockFlow. | Initial creation of agent workflow instructions. |
| `README.md` | High-level project overview and quick start information. | Replaced placeholder with full project summary. |
| `.gitignore` | Defines files and folders excluded from version control. | Removed lock files from ignore list to keep dependency tracking consistent. |
| `.gitattributes` | Configures binary detection and Git LFS tracking rules. | Consolidated LFS rules to avoid conflicts and removed broad public wildcard. |
| `.gitlfsconfig` | Repository-specific Git LFS configuration. | Documented default LFS settings for public assets. |
| `.env.example` | Lists required environment variables with placeholders. | Updated Supabase-focused defaults and marked Google Sheets export as optional. |
| `CHANGELOG.md` | Records notable changes across releases. | Logged version 0.1.0 initial setup. |
| `package.json` | NPM package configuration and dependencies. | Added Next.js 14, Radix UI, and testing dependencies for combobox component. |
| `tsconfig.json` | TypeScript compiler configuration. | Configured strict mode and path aliases for the project. |
| `next.config.js` | Next.js configuration. | Added bundle analyzer support for performance monitoring. |
| `tailwind.config.ts` | Tailwind CSS configuration. | Set up custom theme with design tokens for the component library. |
| `postcss.config.js` | PostCSS configuration. | Configured Tailwind CSS and Autoprefixer. |
| `jest.config.js` | Jest testing configuration. | Set up test environment with coverage thresholds. |
| `jest.setup.js` | Jest setup file. | Configured testing library matchers. |
| `.eslintrc.json` | ESLint configuration. | Configured Next.js linting rules. |
| `docs/CONTEXT.md` | Captures business context, rules, and decisions. | Documented initial business context. |
| `docs/ARCHITECTURE.md` | Describes technical stack and architecture decisions. | Documented initial architecture. |
| `docs/FILE_INVENTORY.md` | Tracks project files, their purposes, and changes. | Added Codex binary-prevention assets to inventory. |
| `docs/SETUP.md` | Provides environment, tooling, and deployment instructions. | Documented setup steps for local and Vercel environments. |
| `docs/CODEX_GUIDELINES.md` | Binary prevention and Git LFS guidance for AI contributors. | Added verification checklist and critical Codex safeguards. |
| `docs/COMBOBOX_DECISIONS.md` | Architectural decisions for cascading combobox component. | Documented all key design decisions with trade-off analysis. |
| `docs/COMBOBOX_API.md` | API reference for cascading combobox component. | Comprehensive prop documentation and usage examples. |
| `docs/COMBOBOX_USAGE.md` | Usage guide for cascading combobox component. | Common patterns, integration examples, and best practices. |
| `app/layout.tsx` | Root layout component for Next.js app. | Created with Inter font and global styles. |
| `app/globals.css` | Global CSS styles with Tailwind directives. | Set up design tokens and base styles. |
| `app/page.tsx` | Home page component. | Created landing page with link to demo. |
| `app/demo/combobox/page.tsx` | Demo page for cascading combobox component. | Showcases independent and cascading field examples with debug panel. |
| `app/api/brands/route.ts` | API route for fetching brands. | Mock API with ETag support and search functionality. |
| `app/api/models/route.ts` | API route for fetching models. | Mock API with brand filtering and ETag support. |
| `app/api/model-numbers/route.ts` | API route for fetching model numbers. | Mock API with cascading filters and ETag support. |
| `app/api/colors/route.ts` | API route for fetching colors. | Mock API for independent field example. |
| `components/ui/cascading-combobox.tsx` | Main cascading autocomplete combobox component. | Production-ready component with fuzzy search, caching, and accessibility. |
| `components/debug/debug-panel.tsx` | Debug panel for visualizing component state. | Shows current values, cache entries, and statistics. |
| `lib/types/combobox.ts` | TypeScript type definitions for combobox. | Comprehensive interfaces for props, state, and API responses. |
| `lib/utils/cache.ts` | ETag-based cache utility with sessionStorage. | Implements LRU eviction and efficient revalidation. |
| `lib/utils/cn.ts` | Utility for merging Tailwind CSS classes. | Combines clsx and tailwind-merge for className handling. |
| `lib/utils/fuzzy-search.ts` | Fuzzy search utilities using Fuse.js. | Client-side search with highlighting and ranking. |
| `lib/hooks/use-debounced-search.ts` | Custom hook for debounced API calls. | Implements request cancellation and caching. |
| `lib/data/mock-data.ts` | Mock data for testing the combobox component. | Sample brands, models, model numbers, and colors. |
