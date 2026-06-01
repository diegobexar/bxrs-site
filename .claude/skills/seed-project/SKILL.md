---
name: seed-project
description: Seed a new BXRS.ART portfolio project into Sanity from an image + notes — draft the lede/description in brand voice, recommend tile variant + AA-safe card colors, then write it as a reviewable draft. Use when the user wants to add or seed a project, fill an imported portfolio stub, or types /seed-project.
argument-hint: [image-path] [notes…]
---

# Seed a BXRS project

Turn an image + rough notes into a publish-ready **draft** `project` document in Sanity. You own the judgment — copy, color, variant; the helper scripts own the mechanical writes. Keep Diego in the loop: present drafts and options, get a nod, then write. Never auto-publish from this skill.

## Before you start
- **Load the brand voice.** Read `bxrs-design/SKILL.md` and the **CONTENT FUNDAMENTALS** in `bxrs-design/README.md`. Non-negotiable voice rules: first-person singular, terse and dry, **sentence case** for `description`/`lede`, em dashes, single-quoted work titles, **no emoji, no exclamation points, no corporate hedging** ("passionate about", "excited to share"). Gallery wall text crossed with a zine.
- This writes to the **production** dataset as a **draft** (`drafts.` id). Diego reviews and publishes in Studio. The mechanical recipe, field map, palette, and voice examples live in [reference.md](reference.md) — read it before step 5.

## Inputs
- An **image** — local file path. Open it with Read to inform copy and color.
- **Notes** — title, year, materials/medium, what it's about, where it ran, anything.

If either is missing, ask. Filling several imported stubs? Do them **one at a time** — Diego prefers per-project questioning over bulk forms.

## Steps

### 1. Draft copy → get approval
From the image + notes, draft:
- **`description`** — the 2-row grid-card blurb. ~160 chars max. Sentence case, concrete, dry — what the thing *is*.
- **`lede`** — the 3-row serif intro on the project page. One to three short sentences; a beat of context.
- **`materials`** — e.g. "Paper collage on board, 18×24 in."

Match the voice examples in [reference.md](reference.md). Present both, name the tradeoffs, let Diego edit before anything is written.

### 2. Recommend a tile variant
Choose `tileVariant` from the image: `image-bleed` (strong full-frame image), `image-bar` (image + caption bar), `image-corner` (graphic / partial image), `color` (no image, type-forward), `type-only` (text as the art), `video` (also needs `videoDuration`, "M:SS"). The image variants — `image-bleed`, `image-bar`, `image-corner`, `video` — require a `tileImage`. Recommend one; offer 1–2 alternates with a reason.

### 3. Recommend colors → AA-safe only
Pick a `cardBackgroundColor` from the BXRS primitives (see [reference.md](reference.md)) that suits the work — pull a hue from the image, or set a deliberate counter-color. Then get valid text options from the helper:

```bash
node ${CLAUDE_SKILL_DIR}/scripts/contrast.mjs "#C61F12" "#FFD60A" "#0A1F8A"
```

Offer 2–3 background + `cardTextColor` pairs that pass AA (≥ 4.5:1). **Never propose a pair the helper flags as failing.** Washes/paper take ink text; deep hues take paper or white text.

### 4. Confirm the rest
`title`, `slug` (kebab-case of title), `year`, `categories` (tags array), `order` (default 999). Placement defaults: **`showOnHomepage: true`, `pinToTopRow: false`** — on the featured grid, unpinned. Confirm before writing.

### 5. Write it as a draft
Follow the recipe in [reference.md](reference.md):
1. Image variant? Upload the asset: `` asset_id=$(${CLAUDE_SKILL_DIR}/scripts/upload-image.sh <image>) `` → prints the asset `_id`.
2. Write a mutations JSON: a single `create` of a `drafts.<uuid>` project (get a uuid with `uuidgen`), referencing the asset in `tileImage`.
3. Post it: `${CLAUDE_SKILL_DIR}/scripts/create-doc.sh <json>`.
4. Report the result and tell Diego to publish: `/studio` → Projects → the new draft → Publish.

## Notes
- No schema changes happen here, so no `schema:deploy` is needed. If a write is ever rejected with "Unknown document type", that's the known schema-drift gotcha — see CLAUDE.md.
- Stay inside the design system: no invented colors or radii, no gradients on UI, Raygun is wordmark-only.
