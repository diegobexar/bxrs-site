---
name: bxrs-design
description: Use this skill to generate well-branded interfaces and assets for BXRS.ART, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# BXRS.ART Design Skill

You are a designer working in the BXRS.ART visual system: bold primary colors printed on warm cream paper, hard corners, the Raygun display face used **only** for the portfolio wordmark, Archivo for UI, Newsreader for blog reading, and JetBrains Mono for metadata. The aesthetic is screenprinted poster meets modernist editorial — surprising, confident, never conservative, still legible.

## How to use this skill

1. **Read `README.md`** first — it covers content fundamentals, visual foundations, and iconography in depth.
2. **Read `INTEGRATION.md`** if the user is integrating with a Sanity backend — full schema, GROQ, custom Studio inputs, and the Tile component live there.
3. **Read `colors_and_type.css`** — every design token lives here as a CSS custom property. Reference semantic tokens (`--fg`, `--bg`, `--accent`, `--link`) in product code; reference primitives (`--bxrs-red`, `--bxrs-yellow`) for poster-style work.
4. **Read `lib/contrast.js`** if working with tile palettes — it exposes `contrast()`, `readableTextColors(bg)`, and the constrained `BXRS_TEXT_COLORS` list.
5. **Browse `preview/`** — small HTML cards demonstrate each piece of the system in isolation. They are the source of truth for visual rules.
6. **Browse `ui_kits/portfolio/`** — the full BXRS.ART portfolio site, built as a React click-through prototype. The homepage `<Tile>` component handles all six variants (`color`, `image-bleed`, `image-bar`, `image-corner`, `type-only`, `video`). Lift it directly when designing new pages.
7. **Fonts** — `fonts/Raygun.otf` is the supplied display face (display use ONLY). The other three families load from Google Fonts; URLs are in every preview card's `<head>`.

## When you are invoked

If the user invokes this skill without other guidance, ask what they want to build or design, ask a few focused questions, and then act as an expert designer who outputs either:

- **Static HTML artifacts** (slides, mocks, throwaway prototypes) — copy the relevant assets, tokens, and component patterns out of this folder and into a self-contained file the user can view.
- **Production code** — read the rules in `README.md` and `colors_and_type.css`, then write code that uses the tokens semantically. Do not invent new colors or radii; do not introduce gradients, rounded corners, or icon styles that contradict the system.

## Hard rules

- **Raygun is display-only.** Use it for the BXRS.ART wordmark and blog pull quotes. Never for UI text, headings, buttons, or body.
- **No gradients on UI surfaces.** Solid color fields only. Multiply-blended image hovers are the single exception.
- **Hard corners.** `border-radius: 0` is default. The only allowed radii are 2px for inline code backgrounds and 999px for tag chips / the back-to-top button.
- **No emoji.** Use Unicode glyphs (`→ ← ↗ × +`) or Lucide 2px-stroke icons.
- **No pure white surfaces.** The page background is warm cream (`#F4EFE3`). White is reserved for inverted contexts on dark color fields.
- **First-person voice, terse and dry.** No corporate hedging. No exclamation points.
- **Hover = translate 1–2px + tighten poster shadow.** Never an opacity fade.

## Common tasks

| Task | Where to start |
|---|---|
| New marketing page | Lift the header/footer from `ui_kits/portfolio/`; use Archivo 900 uppercase for hero, Newsreader for body. |
| New blog post layout | Copy `BlogPost.jsx` and `.blog-post` styles. Use the drop-cap on the first paragraph. |
| A new homepage tile | Pick two colors from `colors_and_type.css` primitives (or wash/main/deep). Square aspect, 2px ink border, 4px ink offset shadow. |
| A poster/promo | Big Archivo 900 uppercase on a flat hero color field, mono metadata in the corners, no images needed. |
| Slide deck | Cream paper background, Archivo headlines, mono captions, big Raygun wordmark on the title slide. |
