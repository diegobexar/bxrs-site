#!/usr/bin/env node
// AA contrast check against the constrained BXRS text palette.
// Mirrors src/lib/contrast.ts (BXRS_TEXT_COLORS + WCAG 2.1 ratio).
// Usage: node contrast.mjs "#C61F12" ["#FFD60A" ...]
//   Prints, per background, the text-palette colors that pass AA (>=4.5:1).

const TEXT = [
  ["INK", "#111111"], ["INK-2", "#2A2A2A"], ["PAPER", "#F4EFE3"], ["PAPER-2", "#ECE5D2"],
  ["YELLOW", "#FFD60A"], ["RED-DEEP", "#C61F12"], ["BLUE-DEEP", "#0A1F8A"],
  ["GREEN-DEEP", "#063A1E"], ["VIOLET-DEEP", "#361482"], ["WHITE", "#FFFFFF"], ["BLACK", "#000000"],
];

const relLum = (hex) => {
  const c = hex.replace("#", "").match(/.{2}/g).map((h) => parseInt(h, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const la = relLum(a), lb = relLum(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

const bgs = process.argv.slice(2);
if (!bgs.length || !bgs.every((b) => /^#[0-9a-fA-F]{6}$/.test(b))) {
  console.error('usage: node contrast.mjs "#RRGGBB" ["#RRGGBB" ...]');
  process.exit(1);
}

for (const bg of bgs) {
  const rated = TEXT.map(([n, h]) => ({ n, h, r: ratio(bg, h) })).sort((a, b) => b.r - a.r);
  const aa = rated.filter((c) => c.r >= 4.5);
  console.log(`\nBG ${bg}`);
  console.log("  AA-valid text:", aa.length
    ? aa.map((c) => `${c.n} ${c.h} (${c.r.toFixed(1)})`).join("   ")
    : "— none in palette; pick a different background");
  console.log("  best:", `${rated[0].n} ${rated[0].h} (${rated[0].r.toFixed(1)})`);
}
