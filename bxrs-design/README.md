# BXRS.ART — Design System

A bold, primary-color visual system for **BXRS.ART**, the personal portfolio site of a working artist. The site is organized around a tiled mosaic homepage (square cards, one per project, each with its own background+text colors chosen in Sanity), an image- and video-forward project view, and a long-form blog optimized for reading on desktop and mobile.

The aesthetic is **screenprinted poster** meets **modernist editorial**: hard corners, primary inks (red / yellow / blue / green / violet) printed on warm cream paper, big uppercase display, dense mono metadata, and serif body for blog reading. Nothing is rounded, nothing is fuzzy. It should feel like a hand-printed catalog raisonné — surprising but legible.

---

## Sources

This system was built from a short written brief and one uploaded asset. There is no existing codebase, Figma file, or live site to mirror; the design language was derived from the brief and from typographic intent.

- **`uploads/Raygun.otf`** — display typeface, supplied by the artist. Used **only** for the portfolio wordmark and a few editorial flourishes (e.g. blog pull quotes). Never for UI text.
- **Brief notes (paraphrased):** Primary colors with smart variations. Bold, surprising, not conservative, still usable. Homepage is a grid of square cards; each card's bg/fg color is set per-project in Sanity. Title uppercase bold, optional short description beneath. Heavy use of images and video. Blog needs an excellent reading experience on desktop and mobile.
- **CMS:** Sanity (referenced in brief — the `cardBackgroundColor` / `cardTextColor` per-project fields drive the homepage palette).

Because no existing UI exists, the UI kit in this system is the **starting point** for the site, not a recreation of it. Treat it as v1 — opinionated but iterable.

---

## Index

| File | What's in it |
|---|---|
| `README.md` | This document — context, content fundamentals, visual foundations, iconography |
| `INTEGRATION.md` | **How to wire this into your Sanity + React codebase** — schema, GROQ, Tile component, setup |
| `SKILL.md` | Agent-skill manifest — drop this folder into Claude Code and invoke `bxrs-design` |
| `colors_and_type.css` | All design tokens (CSS custom properties) + semantic element styles |
| `fonts/` | Webfont files — `Raygun.otf` (supplied); other families load from Google Fonts |
| `assets/` | Logos, marks, placeholder imagery |
| `preview/` | Self-contained HTML cards rendered into the Design System tab |
| `ui_kits/portfolio/` | The BXRS.ART portfolio site UI kit — homepage, project page, blog post, blog index |

---

## CONTENT FUNDAMENTALS

The voice on BXRS.ART is **first-person, terse, and confident**. The artist is speaking directly — no marketing-team plural, no third-person bio voice, no exclamation points. Copy is short, declarative, and unafraid of a blank line.

### Voice & person
- **First-person singular.** "I made this in 2024." "I work mostly at night." Never "we." Never "the artist."
- **You** (second person) is used for the reader when navigating: "Read the studio notes," "See more in *Field Recordings*." Used sparingly.
- **No corporate hedging.** Avoid "passionate about," "love to," "excited to share." If you wouldn't say it on a postcard, don't put it on the site.

### Casing
- **UPPERCASE** for: portfolio wordmark, project titles on homepage cards, all section headers (H1–H4), nav items, button labels, eyebrows.
- **Sentence case** for: blog post titles within the post (the index uses uppercase), body copy, captions, descriptions under homepage cards.
- **lowercase as a stylistic choice** in studio notes and image captions is OK, sparingly — "no flash. handheld. ektar 100." That texture is part of the brand. Don't force it.

### Punctuation
- Em dashes — yes. The site loves an em dash.
- Ellipses … rarely; usually a period suffices.
- Oxford comma: yes.
- Single quotes for titles in body copy: 'Field Recordings' rather than "Field Recordings."

### Examples
| Bad | Good |
|---|---|
| "Welcome to my portfolio! I'm so excited to share my work with you." | "BXRS.ART. Paintings, prints, and short films, 2018–." |
| "Click below to learn more about this project." | "Read studio notes →" |
| "This piece explores themes of memory and displacement." | "Started in a kitchen in Lisbon. Finished in a basement in Cleveland. Two years between." |
| "Featured in numerous publications including..." | "Press: Frieze, Aperture, It's Nice That." |
| "About Me" | "ABOUT" |

### Emoji
**No.** No emoji anywhere in product copy. The brand has its own visual vocabulary (color, type, hard edges) — emoji breaks it. Unicode arrows (→ ← ↗) and the bullet (•) are fine.

### Vibe
Think gallery wall text crossed with a zine. Confident, dry, unfussy. The work is doing the talking; copy is the frame.

---

## VISUAL FOUNDATIONS

### Color philosophy
A **primary-color** system. Five hero hues — **red, yellow, blue, green, violet** — printed on warm **cream paper** with near-black **ink** for text. Each hero ships with a *-deep* (about 35% darker, used for hover states, headings on color, pressed buttons) and a *-wash* (a tint, used for surfaces, callouts, hover-fill on outline buttons).

The homepage is the showcase: every project card sets its own `cardBackgroundColor` + `cardTextColor` from this palette, so the homepage reads as a **printed poster grid** — never the same row twice. The artist controls the rhythm by sequencing projects.

- **No gradients.** Solid fields only. The single permitted gradient is a `mix-blend-mode: multiply` on image hovers if needed; never a UI gradient.
- **No transparency on UI surfaces** except for hairlines (~10% black) and image overlays.
- **High contrast.** Default body text is `--bxrs-ink` (#111) on `--bxrs-paper` (#F4EFE3). Yellow text on white is forbidden; yellow is always paired with ink.

### Typography
Three families, strict roles.

| Family | Role | Used for |
|---|---|---|
| **Raygun** | Display | Portfolio wordmark + blog pull quotes ONLY |
| **Archivo** (Google) | Sans / UI | All headings (H1–H4), nav, buttons, body in product UI |
| **Newsreader** (Google) | Reading serif | Blog post body, long-form prose |
| **JetBrains Mono** (Google) | Mono | Metadata, captions, eyebrows, dates, image EXIF, code |

Archivo is set in **800–900 weight, uppercase, tight tracking** for headings — a punchy, almost-condensed feel. Body uses 400 regular. Newsreader uses optical sizing (`opsz`) for screen comfort and runs at 20px / 1.65 leading in the blog.

### Backgrounds
- **Default page background:** cream paper (`--bxrs-paper`).
- **Card surfaces (UI):** either cream-2 (warmer cream) or a flat hero color.
- **Project pages:** the project's `cardBackgroundColor` carries through as the page background — the project owns the page.
- **No textures, no patterns, no noise overlays.** The cream itself is the texture. (If we ever add grain it should be SVG-based and toggleable — not the default.)
- **Imagery:** photography is shown full-bleed against the page background, ideally on its own row. Color photography is preferred warm, slightly desaturated, like color-negative film (Portra / Ektar). B&W is permitted and looks great against any hero color. No filters, no grain, no vignettes added by the site.

### Layout
- **12-column grid** with 24px gutters on desktop, 4-column with 16px gutters on mobile.
- **Generous margins.** Outer page padding is 48px desktop, 20px mobile.
- **Hard corners.** `--radius-0` is the default. The only exception is `radius-pill` for tag chips and the floating "back to top" button.
- **Asymmetry is good.** Project pages should mix full-bleed images with 6-column text columns offset to one side.

### Cards
The signature card style is a **flat color field with a 2–3px black border and a hard offset shadow** (`--shadow-poster`: `4px 4px 0 #111`). The shadow does not blur. On hover, the card translates `1px 1px` and the shadow shrinks proportionally — it feels like pressing a button on a poster.

Homepage project cards are square (`aspect-ratio: 1`), display the project title in uppercase bold (auto-fitted to card width), and an optional description in the card's secondary text color (typically a 70% mix of `cardTextColor` over `cardBackgroundColor`). No images on the homepage card itself — the **color IS the poster**.

### Borders
- **1px** hairlines for table rows, list dividers — `--hairline` (10% black).
- **2px** solid ink for buttons, inputs, card borders — the workhorse weight.
- **3px** solid ink for hero callouts, the wordmark underline, section dividers.

### Shadows
Two systems, used separately, never mixed.
- **Poster shadow** (hard, offset, no blur): default for cards, buttons in their "poster" variant. Sizes: `4px 4px 0`, `8px 8px 0`, `14px 14px 0`.
- **Soft shadow** (subtle): only on floating UI like the lightbox close button and the floating "back to top." `0 4px 24px rgba(0,0,0,0.06)`.

### Animation
Sparing. The site is mostly **static** — design is doing the moving. When motion is used:
- **Durations:** 120ms (fast — buttons), 200ms (default — hover states, cards), 360ms (slow — page transitions).
- **Easing:** `cubic-bezier(0.2, 0.7, 0.2, 1)` for ease-out (most things). `cubic-bezier(0.6, 0, 0.2, 1)` for snap (page transitions).
- **No bounces, no springs, no float-in-from-bottom on scroll.** No parallax. No scroll-driven anything except the standard "header shrinks at the top" pattern.
- **Page transitions:** a fast 200ms crossfade between project pages, no slide.
- **Image hovers on the homepage:** the card translates 1px and shadow tightens. That's it.

### Hover states
- **Cards:** translate `1px 1px`, shadow tightens from `4px 4px 0` → `2px 2px 0`. Background color unchanged.
- **Outline buttons:** fill with the button's color, text inverts to paper.
- **Solid buttons:** background shifts to *-deep variant.
- **Text links (blog):** underline thickens from 2px → 3px. Color shifts to `--link-hover`.
- **No opacity-fade hovers.** Color does the work.

### Press / active states
- **Buttons:** translate `1px 1px` + shadow goes to `0px 0px` (fully pressed).
- **Cards:** same as hover, slightly more pronounced (`2px 2px`).
- **No scale transforms.** Translation only.

### Transparency & blur
Almost never. Permitted uses:
- Image hover overlay (`rgba(0,0,0,0.0–0.4)` fade-up) for caption legibility.
- Modal/lightbox backdrop: `rgba(17,17,17,0.92)` solid, no blur.
- Sticky header on scroll: solid cream background, no blur.
- **No frosted glass.** No `backdrop-filter`.

### Corner radii
- `0px` — default. Cards, buttons, inputs, images.
- `2px` — `code` inline backgrounds. That's it.
- `999px` — chips/tags and the round "back to top" button.

### Imagery treatment
- Warm, film-leaning color. Slightly desaturated. Avoid Instagram-style HDR.
- B&W is welcome. Sepia is not.
- Full-bleed where possible on project pages.
- No drop shadows, no rounded corners, no borders on images by default. The image is the image.
- Captions live below the image in `--font-mono`, uppercase, `--fg-3`.

### Fixed elements
- Header: sticky to top, 64px tall, solid cream, 2px ink hairline below.
- Footer: full-width, ink background, cream text. Includes a giant Raygun wordmark.
- Floating "back to top" button: bottom-right on long pages only.

---

## ICONOGRAPHY

The BXRS.ART aesthetic prefers **typographic UI** (arrows, plus signs, x's typed as glyphs) over an icon library where possible. Where icons are needed (play/pause, social), we use **Lucide** for its clean 2px stroke that pairs with the 2px ink borders.

### Approach
- **Default:** use a Unicode glyph if it reads cleanly: `→` (next), `←` (back), `↗` (external link), `↑` (top), `+` (add), `×` (close), `•` (bullet).
- **Fallback:** Lucide icons at 24px, `stroke-width: 2`, color = `currentColor` (so they inherit text color and work on any card).
- **No emoji** in UI ever.
- **No icon-only buttons** without a tooltip or screen-reader label.

### Lucide via CDN
Loaded from the official ESM CDN; no font file, no sprite, tree-shakeable in production. Document URLs:
- Web: `https://unpkg.com/lucide-static@latest/icons/{name}.svg`
- React: `lucide-react`

### Allowed icons
Keep the icon vocabulary small — fewer icons make the system feel intentional.
- `play`, `pause` — video player
- `chevron-left`, `chevron-right` — slider / lightbox
- `x` — close
- `arrow-up-right` — external link
- `mail`, `instagram` — contact / social
- `search` — site search if added
- `menu` — mobile nav

### Logo / wordmark
The brand mark IS the typography — **BXRS.ART** set in Raygun, uppercase, with a thick ink underline 3px below the baseline. No standalone logomark. The wordmark is the only display use of Raygun.

---

## CAVEATS

- No existing site or codebase was provided — the UI kit is a **v1 proposal** built from the brief, not a recreation. Iterate freely.
- Body sans (**Archivo**), reading serif (**Newsreader**), and **JetBrains Mono** are Google Font picks that complement Raygun. Swap in any time.
- All imagery in the UI kit is **placeholder** — colored fields, not real artwork. The artist should drop in real work to evaluate the system.

---

See `SKILL.md` for instructions on using this folder as a Claude Code agent skill.
