# BXRS.ART

Portfolio and creative works site powered by Next.js and Sanity CMS.

Repository: `bxrs-site` (single repo containing both the Next.js app and the Sanity Studio under `studio/`).

## Tech Layers
- **Framework**: Next.js 16 (App Router, React Server Components, Turbopack)
- **Language**: TypeScript 6 (strict mode)
- **CMS**: Sanity v5 (headless, separate studio in `studio/`)
- **Styling**: Tailwind CSS 4 (with `@tailwindcss/typography` plugin)
- **Fonts**: Geist Sans + Geist Mono (via `next/font`), custom Raygun header font
- **Images**: `next/image` with Sanity CDN (`cdn.sanity.io`)
- **Testing**: None configured

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, ThemeProvider, Header)
│   ├── page.tsx            # Homepage — pinned + featured project grid
│   ├── blog/               # Blog list + [slug] detail pages
│   ├── info/               # Info/about page (from siteSettings)
│   └── projx/[slug]/       # Project detail pages (block content)
├── components/
│   ├── Header.tsx           # Site header with BXRS.ART branding
│   ├── ThemeProvider.tsx     # Server-side theme from Sanity siteSettings
│   └── blocks/
│       └── BlockRenderer.tsx # Renders Sanity block content arrays
├── sanity/
│   ├── client.ts            # Sanity client (project: izt9f0dq, dataset: production)
│   ├── image.ts             # Image URL builder helper
│   └── sanity.types.ts      # (generated) types for schema + all GROQ queries
studio/                      # Sanity Studio (separate package, excluded from tsconfig)
├── schema.json              # (generated) extracted schema, input to typegen
├── sanity.config.ts         # Studio config (structureTool + visionTool)
└── schemaTypes/
    ├── postType.ts          # Blog post schema
    ├── projectType.ts       # Project schema (cards, content blocks, SEO)
    ├── siteSettingsType.ts  # Site settings (theme, info content, social links)
    └── blockContent/        # Custom block types (image, text, link, heading, color, spacer)
public/
└── fonts/                   # Raygun custom font files (woff, woff2)
```

## Development
```bash
npm install              # Install Next.js dependencies
(cd studio && npm install) # Install Sanity Studio dependencies (separate node_modules)
npm run dev              # Next.js dev server on port 8888 (Turbopack)
npm run dev:all          # Run Next.js (8888) and Sanity Studio in parallel
npm run build            # Production build (Turbopack)
npm run lint             # ESLint (next/core-web-vitals + next/typescript)
npm run studio:dev       # Sanity Studio dev server only
npm run studio:build     # Build Sanity Studio
npm run studio:deploy    # Deploy Sanity Studio
npm run typegen          # Extract schema + regenerate sanity.types.ts
npm run typegen:extract  # Step 1: write studio/schema.json from studio schema
npm run typegen:generate # Step 2: scan GROQ queries and emit src/sanity/sanity.types.ts
```

## Code Standards
- TypeScript strict mode enabled
- ESLint with `next/core-web-vitals` and `next/typescript`
- Path alias: `@/*` maps to `./src/*`
- All pages use React Server Components (async page functions with direct Sanity fetches)
- Tailwind utility classes for all styling — no CSS modules or styled-components in the Next.js app

## Project-Specific Rules
- All data comes from Sanity — no local database, no `.env` files (Sanity project ID is hardcoded in `src/sanity/client.ts`)
- GROQ queries are defined inline in page/component files using `defineQuery` from `next-sanity` so Sanity TypeGen picks them up
- Each query must be assigned to a uniquely-named module-level constant — typegen skips inline queries and rejects duplicate names
- `client.fetch(QUERY, ...)` returns the auto-inferred result type; do not pass an explicit `<SanityDocument>` generic
- Result types are exported from `@/sanity/sanity.types` as `<QUERY_NAME>_RESULT` (e.g. `PINNED_PROJECTS_QUERY_RESULT`)
- Re-run `npm run typegen` after editing the studio schema OR adding/changing a GROQ query
- ISR revalidation: 30s for list pages, 3600s for detail pages
- Project detail pages use the `BlockRenderer` component to render an array of typed content blocks
- Theme (light/dark) is controlled from Sanity `siteSettings`, applied server-side via `ThemeProvider`
- The `studio/` directory is a separate package with its own `node_modules` — not part of the Next.js build
- Homepage grid: pinned projects (max 3, top row) + featured projects (below)

## Sanity Schema
- **post**: Blog posts with title, slug, publishedAt, image, body (Portable Text)
- **project**: Portfolio projects with card styling, content blocks, SEO fields, homepage display controls
- **siteSettings**: Singleton for site title, description, theme, info page content, social links, contact email
- **Block types**: imageBlock, textBlock, linkBlock, headingBlock, colorBlock, spacerBlock — each supports layout fields (maxWidth, alignment)

## Important Notes
- Sanity project ID `izt9f0dq` and dataset `production` are used in both the Next.js client and Studio config
- No environment variables are used — Sanity config is hardcoded (read-only public client, no write token)
- Custom font "Raygun" is loaded via `@font-face` in `globals.css` and applied with the `.header-font` class
- Every route has a `loading.tsx` with a spinner for Suspense boundaries

## Common Mistakes to Avoid
- DON'T: Import from `studio/` in Next.js code — they are separate packages
- DON'T: Use client components unnecessarily — all pages are server components fetching data directly
- DON'T: Forget `await params` in dynamic route pages — Next.js 16 passes params as a Promise
- DON'T: Add images to `next.config.ts` remotePatterns unless they're from a new domain (Sanity CDN is already configured)
- DON'T: Write inline GROQ in `client.fetch()` — wrap in `defineQuery` and assign to a named constant so typegen can pick it up
- DON'T: Pass an explicit type generic to `client.fetch<...>` — typegen's overload provides the result type from the query
- DON'T: Hand-edit `src/sanity/sanity.types.ts` or `studio/schema.json` — they're regenerated by `npm run typegen`
- ALWAYS: Use the `@/*` path alias for imports within `src/`
- ALWAYS: Match block type names between Sanity schema (`studio/schemaTypes/blockContent/`) and `BlockRenderer.tsx`
- ALWAYS: Use Tailwind utility map objects in `BlockRenderer.tsx` for new style options rather than inline logic
- ALWAYS: Run `npm run typegen` after schema edits or any new/changed GROQ query
- ALWAYS: Run `npm run studio:dev` (or `npm run dev:all` for both) from project root (scripts handle `cd studio`)
