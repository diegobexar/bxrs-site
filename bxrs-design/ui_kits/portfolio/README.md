# BXRS.ART Portfolio — UI Kit

A click-through prototype of the BXRS.ART portfolio site. This is a **v1 proposal** — no existing site or codebase was provided, so this kit was built from the brief plus the design tokens in `../../colors_and_type.css`.

## Surfaces

- **Homepage** — square-tile mosaic. Each tile is a project with its own bg/fg color (driven in production by Sanity fields `cardBackgroundColor` / `cardTextColor`). Title is uppercase bold; optional description sits beneath.
- **Project page** — owns the page background. Mixes full-bleed media with a 6-column text column. Includes a simple video block.
- **Blog index** — list of posts with mono metadata.
- **Blog post** — long-form reading view, serif body, Raygun pull quotes.
- **About** — short bio + contact.

## How to use

Open `index.html`. The site is a single-page interactive demo with client-side routing (no real Sanity backend — `data/projects.js` and `data/posts.js` are the mock CMS).

## Files

- `index.html` — entry point, loads React + the JSX components
- `App.jsx` — router / view shell
- `SiteHeader.jsx`, `SiteFooter.jsx` — chrome
- `HomeGrid.jsx` — the mosaic
- `ProjectPage.jsx` — single project view
- `BlogIndex.jsx`, `BlogPost.jsx` — blog
- `AboutPage.jsx` — about
- `data/projects.js`, `data/posts.js` — mock content

## Caveats

- Imagery is **CSS-painted placeholder** — colored fields stand in for paintings/photos/film stills.
- No real video player; the project page has a poster-frame placeholder with a play glyph.
- Lucide icons are loaded inline via SVG paths to avoid the network round-trip in this preview.
