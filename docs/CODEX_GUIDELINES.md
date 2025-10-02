# Codex Contribution Guidelines

These guidelines help AI contributors prepare StockFlow for binary-safe workflows and consistent asset handling.

## Binary Prevention Rules
- Use Git LFS for all binary assets including images, fonts, audio, and video files.
- Never commit raw binaries directly; only LFS pointers should reach the repository.
- Treat archives (zip, tar, gz, bz2, 7z) and design sources (psd, fig, sketch, xd, ai) as binary with `-diff` attributes.
- Lock files remain tracked as plain text to maintain reliable diffing and dependency auditing.
- Verify attributes with `git check-attr -a <file>` before committing new assets.

## Verification Checklist
```bash
# Confirm tracked patterns registered with Git LFS
git lfs track

# Inspect attributes for a specific asset prior to committing
git check-attr -a public/logo.png
# Expected output includes: filter: lfs, diff: lfs, merge: lfs, binary

# Review the list of files currently tracked by LFS
git lfs ls-files
```

## Placeholder Asset Strategy
- When mock visuals are required, prefer hosted placeholders over storing local binaries.
- Use [`https://placehold.co/{width}x{height}`](https://placehold.co) for preview URLs during development.
- Document placeholder usage inside component stories or fixtures for future replacement.

## Icon Strategy
- StockFlow standardizes on [`lucide-react`](https://github.com/lucide-icons/lucide) for iconography.
- Import icons as components rather than bundling SVG assets manually.
- Avoid duplicating icon SVGs inside the repository; reference Lucide exports instead.

## Font Strategy
- Load fonts with `next/font/google` or the appropriate built-in Next.js font loader.
- Do not commit raw font binaries. If a custom font is required, coordinate to host it via LFS or an external CDN.
- Keep font usage centralized to maintain consistent typography across the application.

## Git Apply Recovery Workflow
1. Run `git status` to inspect partial patches or conflicts introduced by `git apply`.
2. Use `git apply --reject --whitespace=fix <patch>` if the initial apply fails to gather `.rej` files for manual resolution.
3. Resolve conflicts by editing affected files and removing any `.rej` artifacts once reconciled.
4. Execute `git add -A` followed by `git diff --staged` to confirm a clean, intentional patch before committing.

## Git LFS Usage Notes
- Initialize LFS locally with `git lfs install` before working with tracked assets.
- Confirm tracked patterns via `git lfs track` and commit updates to `.gitattributes` when new binary types arise.
- Avoid storing secrets or configuration files in LFS—it's dedicated to large binaries only.
- When cloning or pulling, ensure collaborators run `git lfs pull` to download the actual binary content.

## ⚠️ Critical: For All Future Codex Tasks

**Never include:**
- ❌ Creating `favicon.ico`, `logo.png`, or other binary design assets.
- ❌ Downloading or committing font files manually.
- ❌ Generating image, audio, or video binaries inside the repository.

**Always include when assets are required:**
- ✅ Placeholder URLs such as `https://placehold.co/{width}x{height}`.
- ✅ Icons from `lucide-react` components, e.g. `<Icon className="h-4 w-4" />`.
- ✅ Fonts imported via `next/font/google` (or existing shared loaders).
