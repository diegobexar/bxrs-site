# seed-project — reference

Mechanical recipe, field map, palette, and voice examples. Project `izt9f0dq`, dataset `production`, API version `v2021-06-07`.

## Why the raw HTTP API (not the Sanity MCP tools)
The Sanity MCP write/validation tools have been unreliable against this project's deployed schema (a stale hosted schema once made them reject valid types — see the schema-drift note in CLAUDE.md). The helper scripts use the authenticated HTTP API directly, which sidesteps that. The token comes from the logged-in Sanity CLI (`cd studio && npx sanity debug --secrets`); the scripts fetch it for you.

## A. Upload the image asset
```bash
asset_id=$(${CLAUDE_SKILL_DIR}/scripts/upload-image.sh /path/to/work.jpg)
echo "$asset_id"   # e.g. image-9f56307402adf1db755e23c0cbc5dbc05e56efff-1170x1169-jpg
```
Assets are shared (not draft/published) — upload once, reference anywhere. Supported: jpg/jpeg, png, webp, gif. Skip this for `color` / `type-only` variants.

## B. Build the mutations JSON
A single `create` of a **draft** project. Generate an id: `uuidgen | tr 'A-Z' 'a-z'`, then prefix `drafts.`.

```json
{
  "mutations": [
    { "create": {
      "_id": "drafts.PUT-UUID-HERE",
      "_type": "project",
      "title": "Garden City Beast",
      "slug": { "_type": "slug", "current": "garden-city-beast" },
      "description": "Two rows, sentence case. What it is, said plainly.",
      "lede": "A short serif intro. One to three sentences of context.",
      "materials": "Paper collage on board, 18×24 in.",
      "year": 2024,
      "categories": ["Collage", "Poster"],
      "tileVariant": "image-bleed",
      "showOnHomepage": true,
      "pinToTopRow": false,
      "order": 999,
      "cardBackgroundColor": { "_type": "color", "hex": "#C61F12", "alpha": 1 },
      "cardTextColor": "#F4EFE3",
      "tileImage": {
        "_type": "image",
        "asset": { "_type": "reference", "_ref": "image-…-jpg" }
      }
    }}
  ]
}
```

- **Omit `tileImage`** (and the upload) for `color` / `type-only`.
- Add `"videoDuration": "14:00"` for the `video` variant.
- `cardBackgroundColor` is a `color` object — `hex` + `alpha` is enough; Studio backfills rgb/hsl on first edit and the site only reads `.hex`.
- `cardTextColor` is a plain hex **string**.
- `create` (not `createOrReplace`) errors if the id already exists — a fresh uuid each run keeps it safe.

## C. Post it
```bash
${CLAUDE_SKILL_DIR}/scripts/create-doc.sh /tmp/seed-project.json
```
Returns `{"results":[{"id":"drafts.…","operation":"create"}]}`. Then publish in Studio.

## Field map (`project` schema)
| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `slug` | slug | `{_type:"slug", current:"kebab-title"}`, required |
| `description` | text (2 rows) | grid-card blurb |
| `lede` | text (3 rows) | serif page intro |
| `materials` | string | e.g. "Oil on linen, 36×48 in." |
| `showOnHomepage` | boolean | default true (this skill) |
| `pinToTopRow` | boolean | default false; max 3 pinned total across all projects |
| `order` | number | required, ≥1 integer, default 999 |
| `tileVariant` | string | `color` \| `image-bleed` \| `image-bar` \| `image-corner` \| `type-only` \| `video`; required |
| `tileImage` | image | required for image-bleed/-bar/-corner/video |
| `videoDuration` | string | required for `video`; "M:SS" or "H:MM:SS" |
| `cardBackgroundColor` | color | `{_type:"color", hex, alpha:1}` |
| `cardTextColor` | string | hex; must pass AA vs background |
| `year` | number | integer 1900–2100 |
| `categories` | string[] | tags |
| `content` | block[] | composable blocks — leave empty when seeding; add later |
| `seoTitle` / `seoDescription` / `seoImage` | — | optional; leave empty when seeding |

## Brand background palette (`cardBackgroundColor`)
Primitives from `src/styles/bxrs-tokens.css`. Backgrounds are usually a `*-deep` or main hue, or paper/ink:

| Hue | main | deep | wash |
|---|---|---|---|
| Red | `#FF3B2E` | `#C61F12` | `#FFD7D2` |
| Yellow | `#FFD60A` | `#C9A300` | `#FFF3A8` |
| Blue | `#1442FF` | `#0A1F8A` | `#C7D0FF` |
| Green | `#15B257` | `#0B6A33` | `#BFE9CD` |
| Violet | `#6B2BD9` | `#361482` | `#D9CCF5` |
| Neutral | Paper `#F4EFE3` · Paper-2 `#ECE5D2` · Ink `#111111` · Ink-2 `#2A2A2A` · White `#FFFFFF` · Black `#000000` |

`cardTextColor` is drawn from the constrained text palette only — let `scripts/contrast.mjs` pick AA-valid ones. Cream `#F4EFE3` is the canvas; pure white is reserved for text on dark color fields.

## Voice examples — description / lede
| Weak | BXRS |
|---|---|
| "This vibrant collage explores themes of memory and place." | "Cut from a year of newspapers. Reassembled into one face." |
| "A poster I'm really proud of for a local festival!" | "Festival poster. Two colors, one beast, no compromise." |
| "Mixed media artwork created in 2024." | "Paper, ink, and tape on board. 2024." |
| "Featured in numerous exhibitions." | "Shown at the Pulp, summer 2024." |

`description` = the card blurb — what it is, dry. `lede` = the page intro — one beat of context, read in serif. Single-quote work titles in prose: 'Blood & Stone', not "Blood & Stone".
