// Contrast helper — WCAG 2.1 relative luminance + contrast ratio.
// Pure JS so it can be shared between the Sanity Studio input and the
// React render layer. No dependencies.

(function (root) {
  function relLum(hex) {
    const rgb = hex.replace("#", "").match(/.{2}/g).map((h) => parseInt(h, 16) / 255);
    const [r, g, b] = rgb.map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrast(a, b) {
    const la = relLum(a), lb = relLum(b);
    const [hi, lo] = la > lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  }

  // The constrained set of allowed text colors for tiles. Keeps the
  // homepage feeling like a printed catalog instead of a Wix gradient party.
  const BXRS_TEXT_COLORS = [
    { name: "INK",         hex: "#111111" },
    { name: "INK-2",       hex: "#2A2A2A" },
    { name: "PAPER",       hex: "#F4EFE3" },
    { name: "PAPER-2",     hex: "#ECE5D2" },
    { name: "YELLOW",      hex: "#FFD60A" },
    { name: "RED-DEEP",    hex: "#C61F12" },
    { name: "BLUE-DEEP",   hex: "#0A1F8A" },
    { name: "GREEN-DEEP",  hex: "#063A1E" },
    { name: "VIOLET-DEEP", hex: "#361482" },
    { name: "WHITE",       hex: "#FFFFFF" },
    { name: "BLACK",       hex: "#000000" },
  ];

  // For any background color, return BXRS_TEXT_COLORS sorted by contrast,
  // filtered to those that meet WCAG AA large-text (≥3.0) or AA body (≥4.5).
  function readableTextColors(bg, { min = 4.5 } = {}) {
    return BXRS_TEXT_COLORS
      .map((c) => ({ ...c, ratio: contrast(bg, c.hex) }))
      .filter((c) => c.ratio >= min)
      .sort((a, b) => b.ratio - a.ratio);
  }

  // Pick the best single readable text color for a given bg.
  function bestTextColor(bg, { min = 4.5 } = {}) {
    const list = readableTextColors(bg, { min });
    if (list.length) return list[0];
    // Fallback: ignore the min threshold and return whichever has the highest
    // ratio. The validator should still flag the project in Studio.
    return BXRS_TEXT_COLORS
      .map((c) => ({ ...c, ratio: contrast(bg, c.hex) }))
      .sort((a, b) => b.ratio - a.ratio)[0];
  }

  const api = { relLum, contrast, readableTextColors, bestTextColor, BXRS_TEXT_COLORS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BXRSContrast = api;
})(typeof window !== "undefined" ? window : globalThis);
