// WCAG 2.1 relative luminance + contrast ratio.
// Studio-side mirror of src/lib/contrast.ts. Keep in sync.

export type NamedColor = { name: string; hex: string };
export type RatedColor = NamedColor & { ratio: number };

export function relLum(hex: string): number {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((h) => parseInt(h, 16) / 255);
  const [r, g, b] = rgb.map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const la = relLum(a);
  const lb = relLum(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const BXRS_TEXT_COLORS: NamedColor[] = [
  {name: 'INK', hex: '#111111'},
  {name: 'INK-2', hex: '#2A2A2A'},
  {name: 'PAPER', hex: '#F4EFE3'},
  {name: 'PAPER-2', hex: '#ECE5D2'},
  {name: 'YELLOW', hex: '#FFD60A'},
  {name: 'RED-DEEP', hex: '#C61F12'},
  {name: 'BLUE-DEEP', hex: '#0A1F8A'},
  {name: 'GREEN-DEEP', hex: '#063A1E'},
  {name: 'VIOLET-DEEP', hex: '#361482'},
  {name: 'WHITE', hex: '#FFFFFF'},
  {name: 'BLACK', hex: '#000000'},
];

export function readableTextColors(
  bg: string,
  {min = 4.5}: {min?: number} = {},
): RatedColor[] {
  return BXRS_TEXT_COLORS.map((c) => ({...c, ratio: contrast(bg, c.hex)}))
    .filter((c) => c.ratio >= min)
    .sort((a, b) => b.ratio - a.ratio);
}

export function bestTextColor(
  bg: string,
  {min = 4.5}: {min?: number} = {},
): RatedColor {
  const list = readableTextColors(bg, {min});
  if (list.length) return list[0];
  return BXRS_TEXT_COLORS.map((c) => ({...c, ratio: contrast(bg, c.hex)})).sort(
    (a, b) => b.ratio - a.ratio,
  )[0];
}
