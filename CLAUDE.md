# BXRS.ART

Portfolio and creative works site powered by Next.js and Sanity CMS.

Repository: `bxrs-site` (single repo containing both the Next.js app and the Sanity Studio under `studio/`).

## Design System

The site is governed by the **BXRS design system** in `/bxrs-design/`. It is the visual authority — every new page, component, and route must reference it.

- **`bxrs-design/SKILL.md`** — brand voice + hard rules. Invokable as `/skill bxrs-design` for AI-assisted page building.
- **`bxrs-design/README.md`** — visual foundations (color philosophy, type system, layout, hover/press states, imagery, iconography).
- **`bxrs-design/INTEGRATION.md`** — Sanity schema contract + Studio input components + Tile component reference.
- **`bxrs-design/colors_and_type.css`** — single source of truth for tokens (mirrored into `src/styles/bxrs-tokens.css`).
- **`bxrs-design/ui_kits/portfolio/`** — working prototype of all pages and tile variants.
- **`bxrs-design/preview/`** — isolated HTML cards demonstrating each rule.

**Studio is embedded at `/studio`** via `next-sanity/studio` (`src/app/studio/[[...tool]]/page.tsx`). It uses a shared config at `src/sanity/studio-config.ts` that imports schemas directly from `studio/schemaTypes/` — single source of truth, no duplication. The standalone studio under `studio/` still works (`npm run studio:dev`) and uses the same schemas; both write to the same Sanity dataset. Access at `/studio` is protected by Sanity's own auth — only project members of `izt9f0dq` can read or write data.

**At runtime**, the design system surfaces in this repo as:
- `src/styles/bxrs-tokens.css` — token definitions (CSS custom properties + element base styles)
- `src/styles/bxrs-components.css` — component CSS (site-header, site-footer, tile, project, blog-index, blog-post, about)
- `src/lib/contrast.ts` — WCAG contrast helpers; `studio/lib/contrast.ts` is the Studio-side mirror (keep in sync)
- `src/components/Tile.tsx` — six-variant homepage tile
- `src/components/SiteHeader.tsx` + `src/components/NavLinks.tsx` — sticky header (WORK / STUDIO NOTES / INFO)
- `src/components/SiteFooter.tsx` — full-bleed ink footer with giant Raygun wordmark
- `studio/components/TextColorPicker.tsx` — Studio input that enforces AA contrast against `cardBackgroundColor`

## Tech Layers
- **Framework**: Next.js 16 (App Router, React Server Components, Turbopack)
- **Language**: TypeScript 6 (strict mode)
- **CMS**: Sanity v5 (headless, separate studio in `studio/`)
- **Styling**: Tailwind CSS 4 + design system CSS imported from `src/styles/`
- **Fonts**: Archivo (UI), Newsreader (blog body), JetBrains Mono (metadata) via `next/font/google`; Raygun (display only, local `@font-face`)
- **Images**: `next/image` with Sanity CDN (`cdn.sanity.io`)
- **Testing**: None configured

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout — html/body/fonts + metadataBase (no chrome)
│   ├── globals.css         # @import order: tailwind → bxrs-tokens → bxrs-components
│   ├── sitemap.ts          # Generated /sitemap.xml — projects + notes + static routes
│   ├── robots.ts           # Generated /robots.txt — allow all, disallow /studio
│   ├── (site)/             # Route group — site chrome (SiteHeader + SiteFooter)
│   │   ├── layout.tsx      # Wraps children with SiteHeader/SiteFooter
│   │   ├── page.tsx        # Homepage — Tile grid (pinned + featured)
│   │   ├── loading.tsx     # Loading state for site routes
│   │   ├── notes/          # Studio Notes list + [slug] detail pages (generateStaticParams)
│   │   ├── info/           # Info page (feature image + bio + stacks)
│   │   └── projx/[slug]/   # Project detail (structured header + hero tileImage + BlockRenderer; generateStaticParams)
│   └── studio/[[...tool]]/ # Embedded Sanity Studio (NextStudio) — outside (site) group so Studio chrome owns the viewport
├── components/
│   ├── SiteHeader.tsx        # Sticky 64px header (server)
│   ├── NavLinks.tsx          # Client child of SiteHeader — pathname-aware
│   ├── SiteFooter.tsx        # Full-bleed ink footer (server, fetches siteSettings)
│   ├── Tile.tsx              # Six-variant homepage tile
│   ├── MultilineText.tsx     # Splits "\n"-delimited strings into <span> blocks
│   └── blocks/
│       └── BlockRenderer.tsx # Renders composable Sanity block-content arrays
├── lib/
│   ├── contrast.ts         # WCAG contrast helpers + BXRS_TEXT_COLORS
│   └── date.ts             # formatDate — uppercase en-US short date
├── styles/
│   ├── bxrs-tokens.css     # Mirror of bxrs-design/colors_and_type.css
│   └── bxrs-components.css # Component CSS (header/footer/tile/project/blog/about)
├── sanity/
│   ├── client.ts           # Sanity client (project: izt9f0dq, dataset: production) + shared `sanityFetch` ISR options
│   ├── image.ts            # Image URL builder helper
│   ├── queries.ts          # Cross-cutting cache()-wrapped fetchers (getSiteSettings)
│   ├── studio-config.ts    # Shared Sanity config — used by embedded /studio
│   └── sanity.types.ts     # (generated) types for schema + all GROQ queries
studio/                      # Sanity Studio (separate package, excluded from tsconfig)
├── schema.json              # (generated) extracted schema, input to typegen
├── sanity.config.ts         # Studio config (structureTool, visionTool, colorInput)
├── components/
│   └── TextColorPicker.tsx # Custom Studio input — AA-validated swatch picker
├── lib/
│   └── contrast.ts         # Mirror of src/lib/contrast.ts (keep in sync)
└── schemaTypes/
    ├── postType.ts          # Blog post schema (title, slug, publishedAt, image, excerpt, body)
    ├── projectType.ts       # Project schema (description, lede, materials, tileVariant, ...)
    ├── siteSettingsType.ts  # Site settings (singleton — no theme field)
    ├── infoType.ts          # Info page (singleton — featureImage, bio, contactEmail, stacks)
    └── blockContent/        # Composable block types
public/
└── fonts/                   # Raygun custom font files (woff, woff2)
bxrs-design/                 # Design system source (do not edit at runtime — see top of file)
```

## Development
```bash
npm install              # Install Next.js dependencies
(cd studio && npm install) # Install Sanity Studio dependencies (separate node_modules)
npm run dev              # Next.js dev server on port 6969 — also serves the embedded Studio at /studio
npm run dev:all          # Optional: Next.js (6969) + standalone Studio (3333) in parallel
npm run build            # Production build (Turbopack)
npm run lint             # ESLint (next/core-web-vitals + next/typescript)
npm run studio:dev       # Sanity Studio dev server only
npm run studio:build     # Build Sanity Studio
npm run studio:deploy    # Deploy the hosted Studio app
npm run schema:deploy    # Deploy schema to Sanity's hosted schema store (MCP + Studio schema-aware tooling read THIS)
npm run typegen          # Extract schema + regenerate sanity.types.ts (LOCAL types only — does NOT deploy)
npm run typegen:extract  # Step 1: write studio/schema.json from studio schema
npm run typegen:generate # Step 2: scan GROQ queries and emit src/sanity/sanity.types.ts
```

> ⚠️ **Two schema artifacts, two commands.** `typegen` only refreshes the *local* `studio/schema.json` + generated TS types. Sanity's *hosted* schema store (what the Sanity MCP, typed Studio features, and other external tooling validate against) is updated **only** by `npm run schema:deploy`. After any schema-shape change — new field, new type, new singleton — run BOTH, or the hosted schema drifts behind the code (it once silently lacked the `info` type, which blocked MCP writes). A schema deploy needs CLI auth: `cd studio && npx sanity debug` to confirm you're logged in.

## Code Standards
- TypeScript strict mode enabled
- ESLint with `next/core-web-vitals` and `next/typescript` (spread as native flat configs from `eslint-config-next` 16 — no FlatCompat shim; `studio/`, `bxrs-design/`, and generated `sanity.types.ts` are ignored, and `src/components/blocks/**` opts out of `no-explicit-any` for the dynamic block renderer)
- Path alias: `@/*` maps to `./src/*`
- All pages are React Server Components (async page functions with direct Sanity fetches); a single `NavLinks` client component handles active-route highlighting
- Styling: Tailwind utilities for one-off layout; design system CSS classes (`.tile`, `.project`, `.blog-post`, etc.) for all canonical page surfaces

## Project-Specific Rules
- All data comes from Sanity — no local database, no `.env` files (Sanity project ID is hardcoded in `src/sanity/client.ts`)
- GROQ queries are defined with `defineQuery` from `next-sanity` so TypeGen picks them up; each is assigned to a uniquely-named module-level constant. Page-specific queries live inline in the page; cross-cutting reads (e.g. `getSiteSettings`) live in `src/sanity/queries.ts` as `cache()`-wrapped fetchers shared across layout + pages.
- `client.fetch(QUERY, ...)` returns the auto-inferred result type; do not pass an explicit generic
- Result types are exported from `@/sanity/sanity.types` as `<QUERY_NAME>_RESULT`
- Re-run `npm run typegen` after editing the studio schema OR adding/changing a GROQ query. **If the change altered the schema *shape* (new field/type/singleton), ALSO run `npm run schema:deploy`** — typegen only updates local artifacts; the hosted schema store that the Sanity MCP and Studio tooling read is a separate deploy. Skipping it causes schema drift.
- ISR revalidation: 30s across the board (list + detail), via the shared `sanityFetch` options object exported from `src/sanity/client.ts` — pass it as the 3rd arg to every `client.fetch`. Detail pages used to be 3600s; tightened so the artist's edit-iteration loop in Studio doesn't lag for an hour.
- Detail routes (`/projx/[slug]`, `/notes/[slug]`) export `generateStaticParams` so all slugs prerender at build (SSG); ISR keeps them fresh. `src/app/sitemap.ts` + `robots.ts` are generated from Sanity; both `sitemap.ts`/`robots.ts` and `metadataBase` (root layout) hardcode `https://bxrs.art` — update all three together if the canonical domain changes.
- `client` (`src/sanity/client.ts`) uses `useCdn: process.env.NODE_ENV === 'production'` — production hits Sanity's edge cache for speed; dev hits the live API so edits show up immediately.
- Project detail pages render a **structured header** (title + meta + lede + materials) from project fields, then the **hero `tileImage`** (next/image, capped at 64rem, BXRS card signature border + shadow), then a composable body via `BlockRenderer`
- The Info page renders an optional `featureImage` above the H1 in the left column (same card-signature treatment)
- Route group split: `src/app/(site)/` carries SiteHeader + SiteFooter chrome via `(site)/layout.tsx`; the root layout (`src/app/layout.tsx`) is fonts-only. `src/app/studio/` lives outside the group so the embedded Sanity Studio gets the full viewport — without this, its bottom action bar (with the Publish button) gets clipped by SiteFooter.
- The `studio/` directory is a separate package with its own `node_modules` — not part of the Next.js build
- Homepage grid: pinned projects (max 3, top row) + featured projects (below); both rendered via `Tile`

### Design System Rules (non-negotiable)
- **Tokens are the API**: use semantic CSS custom properties (`--bg`, `--fg`, `--accent`, `--font-sans`, `--font-serif`, `--font-mono`, `--font-display`, `--space-*`, `--shadow-poster`, `--ease-out`, etc.). Never hardcode hex outside of CMS color fields and design system token files.
- **Fonts**: `Archivo` for UI/headings, `Newsreader` for blog body and lede, `JetBrains Mono` for metadata/captions/eyebrows. `Raygun` is **display only** — wordmark and blog pull quotes; never UI text, headings, or buttons.
- **Hard corners**: `border-radius: 0` by default. Only `2px` for inline code, `999px` for chips/pill buttons.
- **No emoji** in UI. Use Unicode glyphs (→ ← ↗ × •) or Lucide icons with `stroke-width: 2`.
- **Hovers translate 1–2px + tighten poster shadow.** No opacity fades. No scale transforms.
- **No gradients on UI surfaces.** Multiply-blend overlays on images are allowed.
- **No frosted glass / `backdrop-filter`.**
- **Cream `#F4EFE3` is the canvas.** Pure white is reserved for inverted contexts on dark color fields (e.g. footer text).
- **First-person, terse voice** in user-facing copy. No exclamation points. No "we." No "passionate about." Read `bxrs-design/SKILL.md` for examples.
- **Card/tile signature**: 2px ink border + `4px 4px 0` poster shadow on `--fg`. Hover tightens shadow + translates 2px.
- When building anything new, invoke `/skill bxrs-design` so the design system is loaded into context.

## Sanity Schema
- **post**: `title`, `slug`, `publishedAt`, `image`, `excerpt`, `body` (Portable Text)
- **project**: `title`, `slug`, `description` (2-row, card blurb), `lede` (3-row, serif intro), `materials`, `showOnHomepage`, `pinToTopRow`, `order`, `tileVariant` (`color | image-bleed | image-bar | image-corner | type-only | video`), `tileImage`, `videoDuration`, `cardBackgroundColor` (color picker), `cardTextColor` (contrast-validated picker), `year` (number, e.g. 2024), `categories`, `content` (composable blocks), SEO fields
- **siteSettings**: singleton — `siteTitle`, `siteDescription` (drives homepage headline + SEO), `socialLinks`, `contactEmail`. No `theme` field — site is cream-only by design.
- **info**: singleton — `title`, `featureImage` (portrait above the H1), `bio` (Portable Text paragraphs), `contactLabel`, `contactEmail` (overrides siteSettings), `stacks` (array of `{heading, rows: [{label, value}]}`). Drives `/info` page.
- **Block types**: `imageBlock`, `textBlock`, `linkBlock`, `headingBlock`, `colorBlock`, `spacerBlock` — all support layout fields (`maxWidth`, `alignment`)

### Singletons
Defined in `studio/schemaTypes/index.ts` as the `SINGLETONS` array. Both Studio configs (standalone + embedded) use `studio/structure.ts` to render each singleton as a single document in the Studio left rail and block duplicate/delete actions. To add a new singleton: add its `type`/`id`/`title` to `SINGLETONS` and the schema/structure pick it up automatically.

## Important Notes
- Sanity project ID `izt9f0dq` and dataset `production` used in both the Next.js client and Studio config
- No environment variables — Sanity config is hardcoded (read-only public client, no write token)
- Raygun loaded via `@font-face` in `src/styles/bxrs-tokens.css` and applied via the `.bxrs-wordmark` class or `var(--font-display)`
- Every route has a `loading.tsx` rendering an `.eyebrow` "Loading…" — no spinners (per voice rules)
- `studio/components/TextColorPicker.tsx` reads sibling `cardBackgroundColor` via `useFormValue(['cardBackgroundColor'])`; only swatches meeting AA contrast (4.5:1) are enabled

## Common Mistakes to Avoid
- DON'T: Add SiteHeader / SiteFooter to the root layout — they belong in `src/app/(site)/layout.tsx`, never above the studio route
- DON'T: Import from `studio/` in Next.js code — they are separate packages
- DON'T: Use client components unnecessarily — all pages are server components fetching data directly. The only client island is `NavLinks` for active-route highlighting.
- DON'T: Forget `await params` in dynamic route pages — Next.js 16 passes params as a Promise
- DON'T: Add images to `next.config.ts` remotePatterns unless they're from a new domain (Sanity CDN is already configured)
- DON'T: Hand-edit `src/sanity/sanity.types.ts` or `studio/schema.json` — they're regenerated by `npm run typegen`
- DON'T: Ship a schema-shape change without `npm run schema:deploy` — `typegen` alone leaves Sanity's hosted schema store stale (the cause of past `info`-type drift that blocked MCP writes)
- DON'T: Rely on the Sanity MCP write/patch tools when its validation can't see a type — fall back to the authenticated CLI mutate API (`https://<projectId>.api.sanity.io/v2021-06-07/data/mutate/<dataset>` with the token from `cd studio && npx sanity debug --secrets`); patch the published doc directly and pin `ifRevisionID`
- DON'T: Use opacity-fade hovers, rounded corners, gradients on UI, or emoji — see Design System Rules above
- DON'T: Set Raygun on anything besides the wordmark or a blog pull quote
- ALWAYS: Use the `@/*` path alias for imports within `src/`
- ALWAYS: Match block type names between Sanity schema (`studio/schemaTypes/blockContent/`) and `BlockRenderer.tsx`
- ALWAYS: Use Tailwind utility map objects in `BlockRenderer.tsx` for new style options rather than inline logic
- ALWAYS: Run `npm run studio:dev` (or `npm run dev:all` for both) from project root (scripts handle `cd studio`)
- ALWAYS: When the same query is fetched from both `generateMetadata` and the page component, wrap the fetch in `cache()` from `react` so it only round-trips once
- ALWAYS: When changing `src/lib/contrast.ts`, mirror the same change into `studio/lib/contrast.ts` (and vice versa)
