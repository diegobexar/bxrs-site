# Integrating BXRS.ART into Your Sanity Project

Two paths, pick one (or both):

- **Path A — Drop the folder into your codebase** as a design reference. Best if you're hand-coding the site and want the tokens, fonts, and patterns at hand.
- **Path B — Install as a Claude Code skill** so an AI agent can build new pages in this brand. Best if you want help building.

Either way, the Sanity schema below is the same — that's the contract between content and design.

---

## Part 1 — The Sanity Schema

Two new fields drive each project's homepage tile:

- **`tileVariant`** — one of six layouts: `color` · `image-bleed` · `image-bar` · `image-corner` · `type-only` · `video`
- **`cardBackgroundColor` + `cardTextColor`** — a free color picker for the background, paired with a **constrained, contrast-aware** picker for the text color

Plus conditional fields for `tileImage` (image / video variants) and `videoDuration` (video only).

### Contrast helper

The text-color picker is driven by `lib/contrast.js` (included in this folder). It exposes:

```ts
import { contrast, readableTextColors, BXRS_TEXT_COLORS } from "./lib/contrast";

contrast("#FF3B2E", "#111111");         // → 7.4
readableTextColors("#FF3B2E");          // → [{name:"INK", hex:"#111111", ratio:7.4}, ...]
readableTextColors("#FFD60A", { min: 4.5 }); // AA body
```

`BXRS_TEXT_COLORS` is the fixed set of allowed text colors: `INK`, `INK-2`, `PAPER`, `PAPER-2`, `YELLOW`, `RED-DEEP`, `BLUE-DEEP`, `GREEN-DEEP`, `VIOLET-DEEP`, `WHITE`, `BLACK`. The user can't type in a custom text color — only pick from this list — which keeps the palette from drifting into rounded-corner-Wix territory.

### `project` document type

```ts
// schemas/project.ts
import { defineField, defineType } from "sanity";
import { TextColorPicker } from "./TextColorPicker"; // custom input — see below
import { readableTextColors, contrast } from "../lib/contrast";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug",  type: "slug", options: { source: "title" } }),
    defineField({ name: "year",  type: "number" }),
    defineField({
      name: "medium", type: "string",
      options: { list: ["Painting","Film","Print","Drawing","Sculpture","Installation"] },
    }),
    defineField({
      name: "description", type: "text", rows: 2,
      description: "One short sentence shown under the tile title.",
    }),

    // -------- BACKGROUND COLOR (free picker) --------
    defineField({
      name: "cardBackgroundColor",
      title: "Tile background",
      type: "string",
      description: "Pick any color. The text color picker below filters itself to AA-pass options.",
      // The @sanity/color-input plugin provides a Studio color swatch picker.
      // npm i @sanity/color-input
      components: { input: undefined /* color-input plugin registers globally */ },
      validation: r => r.required().regex(/^#[0-9A-Fa-f]{6}$/, {
        name: "hex", invert: false,
      }),
      initialValue: "#FF3B2E",
    }),

    // -------- TEXT COLOR (constrained, contrast-aware) --------
    defineField({
      name: "cardTextColor",
      title: "Tile text color",
      type: "string",
      description:
        "Only colors that meet WCAG AA contrast (≥4.5:1) against your background are shown.",
      components: { input: TextColorPicker },
      validation: r =>
        r.required().custom((value, ctx) => {
          const bg = ctx.document?.cardBackgroundColor;
          if (!bg || !value) return true;
          const ratio = contrast(bg, value);
          if (ratio < 4.5)
            return `Contrast is ${ratio.toFixed(2)}:1 — needs ≥ 4.5:1 for AA body text.`;
          return true;
        }),
      initialValue: "#111111",
    }),

    // -------- TILE VARIANT --------
    defineField({
      name: "tileVariant",
      title: "Tile layout",
      type: "string",
      description:
        "How this project's tile is drawn on the homepage. " +
        "color = solid field, no image. " +
        "image-bleed = full image with title overlay. " +
        "image-bar = image on top, title on color bar below. " +
        "image-corner = small image in top-right, title on color block. " +
        "type-only = no image, massive title stretched edge-to-edge. " +
        "video = motion poster with play glyph and duration.",
      options: {
        list: [
          { title: "Color only",   value: "color" },
          { title: "Image bleed",  value: "image-bleed" },
          { title: "Image bar",    value: "image-bar" },
          { title: "Image corner", value: "image-corner" },
          { title: "Type only",    value: "type-only" },
          { title: "Video",        value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "color",
      validation: r => r.required(),
    }),

    // -------- TILE IMAGE (image + video variants only) --------
    defineField({
      name: "tileImage",
      title: "Tile image",
      type: "image",
      options: { hotspot: true },
      description: "Required for any variant except 'Color only' and 'Type only'.",
      hidden: ({ parent }) =>
        !parent?.tileVariant ||
        parent.tileVariant === "color" ||
        parent.tileVariant === "type-only",
      validation: r => r.custom((value, ctx) => {
        const v = ctx.parent?.tileVariant;
        const needsImage = v && v !== "color" && v !== "type-only";
        if (needsImage && !value) return "Tile image is required for this variant.";
        return true;
      }),
    }),

    // -------- VIDEO DURATION (video variant only) --------
    defineField({
      name: "videoDuration",
      title: "Video duration",
      type: "string",
      description: "Shown next to the play glyph, e.g. '14:00' or '1:22:30'.",
      hidden: ({ parent }) => parent?.tileVariant !== "video",
      validation: r => r.regex(/^\d{1,2}:\d{2}(:\d{2})?$/, {
        name: "duration", invert: false,
      }),
    }),

    // -------- BODY --------
    defineField({ name: "lede",      type: "text", rows: 3 }),
    defineField({ name: "materials", type: "string" }),
    defineField({ name: "pieces",    type: "number" }),
    defineField({ name: "location",  type: "string" }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        { type: "image", options: { hotspot: true }, fields: [
          { name: "caption", type: "string" },
          { name: "width", title: "Grid columns (1–12)", type: "number",
            initialValue: 12, validation: r => r.min(1).max(12) },
        ]},
        { type: "object", name: "videoBlock", fields: [
          { name: "url", type: "url", title: "Vimeo / mux URL" },
          { name: "poster", type: "image" },
        ]},
      ],
    }),
  ],

  preview: {
    select: {
      title: "title", year: "year",
      bg: "cardBackgroundColor", media: "tileImage",
    },
    prepare: ({ title, year, bg, media }) => ({
      title, subtitle: `${year || ""}  •  ${bg || ""}`, media,
    }),
  },
});
```

### The custom text-color picker

```tsx
// schemas/TextColorPicker.tsx
import { useFormValue, set, unset } from "sanity";
import { Card, Stack, Text, Flex, Box } from "@sanity/ui";
import { readableTextColors, contrast, BXRS_TEXT_COLORS } from "../lib/contrast";

export function TextColorPicker(props: any) {
  const bg = (useFormValue(["cardBackgroundColor"]) as string) || "#F4EFE3";
  const value = props.value as string | undefined;
  const valid = new Set(readableTextColors(bg, { min: 4.5 }).map(c => c.hex));

  const select = (hex: string) => props.onChange(hex ? set(hex) : unset());

  return (
    <Stack space={2}>
      <Flex gap={2} wrap="wrap">
        {BXRS_TEXT_COLORS.map(c => {
          const ok = valid.has(c.hex);
          const ratio = contrast(bg, c.hex).toFixed(1);
          const selected = value === c.hex;
          return (
            <Box key={c.hex}>
              <button
                onClick={() => ok && select(c.hex)}
                disabled={!ok}
                title={`${c.name} · ${ratio}:1${ok ? "" : " (fails AA)"}`}
                style={{
                  width: 56, height: 56,
                  background: c.hex,
                  border: selected ? "3px solid #111" : "2px solid #111",
                  boxShadow: selected ? "3px 3px 0 #111" : "none",
                  cursor: ok ? "pointer" : "not-allowed",
                  opacity: ok ? 1 : 0.25,
                  padding: 0,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: c.hex === "#FFFFFF" || c.hex.startsWith("#F4") ? "#111" : "#FFF",
                }}
              >
                {c.name}
              </button>
            </Box>
          );
        })}
      </Flex>
      <Text size={1} muted>
        Background: <code>{bg}</code> · Showing colors that meet WCAG AA (≥4.5:1).
        Greyed swatches fail and cannot be selected.
      </Text>
    </Stack>
  );
}
```

This gives the artist a visual picker: live swatches showing the actual contrast against their chosen background, with failing options visibly disabled. No accidental yellow-on-cream cards.

### GROQ query

```groq
*[_type == "project"] | order(year desc) {
  "slug": slug.current,
  title, year, medium, description,
  cardBackgroundColor, cardTextColor,
  tileVariant,
  "tileImageUrl": tileImage.asset->url,
  videoDuration,
}
```

---

## Part 2 — The React Tile Component

```tsx
// components/Tile.tsx
import Link from "next/link";

type Project = {
  slug: string;
  title: string;
  year: number;
  medium: string;
  description?: string;
  cardBackgroundColor: string;
  cardTextColor: string;
  tileVariant:
    | "color" | "image-bleed" | "image-bar" | "image-corner"
    | "type-only" | "video";
  tileImageUrl?: string;
  videoDuration?: string;
};

export function Tile({ project, index }: { project: Project; index: number }) {
  const { cardBackgroundColor: bg, cardTextColor: fg, tileVariant: v } = project;
  const idx = String(index + 1).padStart(2, "0");

  const Topline = (
    <div className="tile-topline">
      <span>{idx}</span>
      <span>{project.year} · {project.medium.toUpperCase()}</span>
    </div>
  );
  const Title = (
    <div className="tile-title-block">
      <div className="tile-title">
        {project.title.split("\n").map((l, i) => <span key={i}>{l}</span>)}
      </div>
      {project.description && <div className="tile-desc">{project.description}</div>}
    </div>
  );
  const href = `/work/${project.slug}`;
  const base = { background: bg, color: fg };

  if (v === "image-bleed" && project.tileImageUrl) {
    return (
      <Link href={href} className="tile tile-image-bleed" style={base}>
        <div className="tile-bg" style={{ backgroundImage: `url(${project.tileImageUrl})` }} />
        <div className="tile-veil" style={{ background: `linear-gradient(180deg, transparent 0%, ${bg} 95%)` }} />
        <div className="tile-overlay">{Topline}{Title}</div>
      </Link>
    );
  }
  if (v === "image-bar" && project.tileImageUrl) {
    return (
      <Link href={href} className="tile tile-image-bar" style={base}>
        <div className="tile-image" style={{ backgroundImage: `url(${project.tileImageUrl})` }} />
        <div className="tile-bar">{Topline}{Title}</div>
      </Link>
    );
  }
  if (v === "image-corner" && project.tileImageUrl) {
    return (
      <Link href={href} className="tile tile-image-corner" style={base}>
        <div className="tile-corner-img" style={{ backgroundImage: `url(${project.tileImageUrl})` }} />
        <div className="tile-corner-text">{Topline}{Title}</div>
      </Link>
    );
  }
  if (v === "type-only") {
    const lines = project.title.split("\n");
    return (
      <Link href={href} className="tile tile-type-only" style={base}>
        {Topline}
        <svg className="tile-type-svg" viewBox={`0 0 100 ${lines.length * 22}`} preserveAspectRatio="xMidYMid meet">
          {lines.map((line, i) => (
            <text key={i} x="0" y={(i + 1) * 22 - 4}
              textLength="100" lengthAdjust="spacingAndGlyphs"
              fontFamily="Archivo, sans-serif" fontWeight="900" fontSize="20"
              letterSpacing="-0.4" fill="currentColor"
              style={{ textTransform: "uppercase" }}>
              {line.toUpperCase()}
            </text>
          ))}
        </svg>
        {project.description ? <div className="tile-desc">{project.description}</div> : <div />}
      </Link>
    );
  }
  if (v === "video" && project.tileImageUrl) {
    return (
      <Link href={href} className="tile tile-video" style={base}>
        <div className="tile-bg" style={{ backgroundImage: `url(${project.tileImageUrl})` }} />
        <div className="tile-veil" style={{ background: `linear-gradient(180deg, transparent 0%, transparent 50%, ${bg} 95%)` }} />
        <div className="tile-overlay">
          <div className="tile-topline">
            <span className="play-tag">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="6,3 22,12 6,21" /></svg>
              <span>VIDEO{project.videoDuration ? ` · ${project.videoDuration}` : ""}</span>
            </span>
            <span>{project.year} · {project.medium.toUpperCase()}</span>
          </div>
          <div className="tile-video-center">
            <span className="tile-play" style={{ background: fg }}>
              <svg viewBox="0 0 24 24" width="22" height="22" style={{ fill: bg }}>
                <polygon points="6,3 22,12 6,21" />
              </svg>
            </span>
          </div>
          {Title}
        </div>
      </Link>
    );
  }

  // Default — color
  return (
    <Link href={href} className="tile tile-color" style={base}>
      {Topline}{Title}
    </Link>
  );
}
```

The required `.tile*` CSS classes are in `ui_kits/portfolio/portfolio.css` — copy the `.tile`, `.tile-*` variant blocks, and the `.tile-grid` block into your stylesheet (or import the file directly). Tokens come from `colors_and_type.css`.

---

## Part 3 — Setting Up

### Path A — drop into codebase

1. Copy this folder into `design-system/` (or wherever).
2. Wire up:
   - `design-system/colors_and_type.css` → import at app root
   - `design-system/lib/contrast.js` → import in both Studio (for the picker) and the app
   - `design-system/fonts/Raygun.otf` → into `public/fonts/`, update the `@font-face` URL if needed
   - Add the Google Fonts link in `<head>`:
     ```html
     <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght,ital@6..72,400;6..72,400,1;6..72,500;6..72,600&display=swap" rel="stylesheet">
     ```
3. Install the color-input plugin in your Studio:
   ```bash
   npm i @sanity/color-input
   ```
   In `sanity.config.ts`:
   ```ts
   import { colorInput } from "@sanity/color-input";
   export default defineConfig({ /* ... */ plugins: [colorInput()] });
   ```
4. Add the `project` schema and `TextColorPicker.tsx` from Part 1.
5. Lift `Tile.tsx` from Part 2 into your app and query with the GROQ above.

### Path B — install as a Claude Code skill

The folder is already structured as a skill (`SKILL.md` has the frontmatter).

1. Download this folder (Project → Export).
2. Drop it into `~/.claude/skills/bxrs-design/` (or `.claude/skills/` in your repo for project-scoped).
3. In Claude Code: `/skills` to confirm it shows up. Invoke with:
   - `/skill bxrs-design build a new homepage hero`, or
   - just paste a brief — Claude will read the README, tokens, and components and write code in this style.

Both paths can coexist.

---

## Part 4 — Pre-Ship Checklist

- [ ] `@sanity/color-input` plugin registered in Studio
- [ ] `TextColorPicker.tsx` component registered on the `cardTextColor` field
- [ ] Raygun font file at the path `colors_and_type.css` expects
- [ ] At least one project of each variant exists, so you can see the homepage rhythm
- [ ] `videoDuration` is set on every video-variant project
- [ ] `tileImage` hotspots cropped to square in Studio for image variants
- [ ] Mobile homepage drops to 2 columns (CSS already at `@max-width: 900px`)
- [ ] Every published project passes the AA contrast validator before deploy

---

## Optional Refinements

- **More text colors:** Add to `BXRS_TEXT_COLORS` in `lib/contrast.js` and the picker updates automatically. Pair any new addition with at least one passing bg.
- **AAA contrast (≥7:1):** Tighten the `min` in `readableTextColors()` calls and the validator. About a third of current pairs would still pass.
- **Per-tile rotation / scale:** If you want a subtle "off-axis" feel later, add an optional `tileRotation` field (-2° to +2°) and apply it as a transform. Don't ship without seeing it tiled — it can read as gimmicky fast.
- **Hover preview for video tiles:** Swap `tileImage` for a muted autoplay 4-second loop on hover. Wire to a Mux thumbnail-loop URL.
