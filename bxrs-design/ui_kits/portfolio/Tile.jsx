// Tile — homepage tile component with six variants.
// In production, `tileVariant` is a Sanity field on the project document:
//   "color" | "image-bleed" | "image-bar" | "image-corner" | "type-only" | "video"
//
// Common slots (all variants):
//   topline   — index + year/medium (small mono row at the top)
//   title     — uppercase bold project title
//   desc      — optional one-line description below the title
//
// Image variants expect tileImage; the video variant additionally accepts
// videoDuration (string like "14:00") which is shown next to the play glyph.

function Tile({ project, index, onOpen }) {
  const {
    title, year, medium, description,
    cardBackgroundColor, cardTextColor,
    tileVariant = "color", tileImage, videoDuration,
  } = project;

  const idx = String(index + 1).padStart(2, "0");
  const topline = (
    <div className="tile-topline">
      <span>{idx}</span>
      <span>{year} · {medium.toUpperCase()}</span>
    </div>
  );
  const titleBlock = (
    <div className="tile-title-block">
      <div className="tile-title">
        {title.split("\n").map((line, i) => (
          <span key={i} style={{ display: "block" }}>{line}</span>
        ))}
      </div>
      {description ? <div className="tile-desc">{description}</div> : null}
    </div>
  );

  const baseStyle = {
    background: cardBackgroundColor,
    color: cardTextColor,
  };

  if (tileVariant === "image-bleed") {
    return (
      <button className="tile tile-image-bleed" style={baseStyle} onClick={() => onOpen(project)}>
        <div className="tile-bg" style={{ background: tileImage }} />
        <div className="tile-veil"
          style={{ background: `linear-gradient(180deg, transparent 0%, ${cardBackgroundColor} 95%)` }} />
        <div className="tile-overlay">
          {topline}
          {titleBlock}
        </div>
      </button>
    );
  }

  if (tileVariant === "image-bar") {
    return (
      <button className="tile tile-image-bar" style={baseStyle} onClick={() => onOpen(project)}>
        <div className="tile-image" style={{ background: tileImage }} />
        <div className="tile-bar">
          {topline}
          {titleBlock}
        </div>
      </button>
    );
  }

  if (tileVariant === "image-corner") {
    return (
      <button className="tile tile-image-corner" style={baseStyle} onClick={() => onOpen(project)}>
        <div className="tile-corner-img" style={{ background: tileImage }} />
        <div className="tile-corner-text">
          {topline}
          {titleBlock}
        </div>
      </button>
    );
  }

  if (tileVariant === "type-only") {
    // No image. Title is rendered in SVG so each line stretches to the tile's
    // full width, giving the "massive title fills the card" look without
    // ever overflowing — regardless of how long the title is.
    const lines = title.split("\n");
    return (
      <button className="tile tile-type-only" style={baseStyle} onClick={() => onOpen(project)}>
        <div className="tile-topline">
          <span>{idx}</span>
          <span>{year} · {medium.toUpperCase()}</span>
        </div>
        <svg
          className="tile-type-svg"
          viewBox={`0 0 100 ${lines.length * 22}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label={title.replace(/\n/g, " ")}
        >
          {lines.map((line, i) => (
            <text
              key={i}
              x="0"
              y={(i + 1) * 22 - 4}
              textLength="100"
              lengthAdjust="spacingAndGlyphs"
              fontFamily="Archivo, sans-serif"
              fontWeight="900"
              fontSize="20"
              letterSpacing="-0.4"
              fill="currentColor"
              style={{ textTransform: "uppercase" }}
            >
              {line.toUpperCase()}
            </text>
          ))}
        </svg>
        {description ? <div className="tile-desc">{description}</div> : <div />}
      </button>
    );
  }

  if (tileVariant === "video") {
    return (
      <button className="tile tile-video" style={baseStyle} onClick={() => onOpen(project)}>
        <div className="tile-bg" style={{ background: tileImage }} />
        <div className="tile-veil"
          style={{ background: `linear-gradient(180deg, transparent 0%, transparent 50%, ${cardBackgroundColor} 95%)` }} />
        <div className="tile-overlay">
          <div className="tile-topline">
            <span className="play-tag">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true">
                <polygon points="6,3 22,12 6,21" />
              </svg>
              {videoDuration ? <span>VIDEO · {videoDuration}</span> : <span>VIDEO</span>}
            </span>
            <span>{year} · {medium.toUpperCase()}</span>
          </div>
          <div className="tile-video-center" aria-hidden="true">
            <span className="tile-play" style={{ background: cardTextColor }}>
              <svg viewBox="0 0 24 24" width="22" height="22" style={{ fill: cardBackgroundColor }}><polygon points="6,3 22,12 6,21" /></svg>
            </span>
          </div>
          {titleBlock}
        </div>
      </button>
    );
  }

  // Default: color-only.
  return (
    <button className="tile tile-color" style={baseStyle} onClick={() => onOpen(project)}>
      {topline}
      {titleBlock}
    </button>
  );
}

Object.assign(window, { Tile });
