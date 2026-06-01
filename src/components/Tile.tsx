import Link from "next/link";
import { MultilineText } from "@/components/MultilineText";
import type { TileVariant } from "../../studio/lib/tileVariants";

export type { TileVariant };

export type TileProject = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  description?: string | null;
  cardBackgroundColor?: { hex?: string | null } | string | null;
  cardTextColor?: string | null;
  tileVariant?: TileVariant | null;
  tileImageUrl?: string | null;
  videoDuration?: string | null;
};

type Props = { project: TileProject };

const FALLBACK_BG = "#F4EFE3";
const FALLBACK_FG = "#111111";

function bgHex(value: TileProject["cardBackgroundColor"]): string {
  if (!value) return FALLBACK_BG;
  if (typeof value === "string") return value;
  return value.hex ?? FALLBACK_BG;
}

export function Tile({ project }: Props) {
  const variant: TileVariant = project.tileVariant ?? "color";
  const bg = bgHex(project.cardBackgroundColor);
  const fg = project.cardTextColor ?? FALLBACK_FG;
  const href = `/projx/${project.slug?.current ?? ""}`;
  const baseStyle = { background: bg, color: fg } as const;

  const TitleBlock = (
    <div className="tile-title-block">
      <div className="tile-title">
        <MultilineText value={project.title} />
      </div>
      {project.description && (
        <div className="tile-desc">{project.description}</div>
      )}
    </div>
  );

  const imgStyle = project.tileImageUrl
    ? { backgroundImage: `url(${project.tileImageUrl})` }
    : undefined;

  if (variant === "image-bleed") {
    return (
      <Link href={href} className="tile tile-image-bleed" style={baseStyle}>
        <div className="tile-bg" style={imgStyle} />
        <div
          className="tile-veil"
          style={{
            background: `linear-gradient(180deg, transparent 0%, transparent 40%, ${bg} 92%)`,
          }}
        />
        <div className="tile-overlay">{TitleBlock}</div>
      </Link>
    );
  }

  if (variant === "image-bar") {
    return (
      <Link href={href} className="tile tile-image-bar" style={baseStyle}>
        <div className="tile-image" style={imgStyle} />
        <div className="tile-bar">{TitleBlock}</div>
      </Link>
    );
  }

  if (variant === "image-corner") {
    return (
      <Link href={href} className="tile tile-image-corner" style={baseStyle}>
        <div className="tile-corner-img" style={imgStyle} />
        <div className="tile-corner-text">{TitleBlock}</div>
      </Link>
    );
  }

  if (variant === "type-only") {
    const lines = (project.title ?? "").split("\n");
    return (
      <Link href={href} className="tile tile-type-only" style={baseStyle}>
        <svg
          className="tile-type-svg"
          viewBox={`0 0 100 ${lines.length * 22}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label={(project.title ?? "").replace(/\n/g, " ")}
        >
          {lines.map((line, i) => (
            <text
              key={i}
              x="0"
              y={(i + 1) * 22 - 4}
              textLength="100"
              lengthAdjust="spacingAndGlyphs"
              fontFamily="var(--font-sans)"
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
        {project.description ? (
          <div className="tile-desc">{project.description}</div>
        ) : (
          <div />
        )}
      </Link>
    );
  }

  if (variant === "video") {
    return (
      <Link href={href} className="tile tile-video" style={baseStyle}>
        <div className="tile-bg" style={imgStyle} />
        <div
          className="tile-veil"
          style={{
            background: `linear-gradient(180deg, transparent 0%, transparent 55%, ${bg} 95%)`,
          }}
        />
        <div className="tile-overlay">
          <div className="tile-topline">
            <span className="play-tag">
              <svg
                viewBox="0 0 24 24"
                width="11"
                height="11"
                fill="currentColor"
                aria-hidden="true"
              >
                <polygon points="6,3 22,12 6,21" />
              </svg>
              {project.videoDuration ? (
                <span>VIDEO · {project.videoDuration}</span>
              ) : (
                <span>VIDEO</span>
              )}
            </span>
          </div>
          <div className="tile-video-center" aria-hidden="true">
            <span className="tile-play" style={{ background: fg }}>
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                style={{ fill: bg }}
              >
                <polygon points="6,3 22,12 6,21" />
              </svg>
            </span>
          </div>
          {TitleBlock}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="tile tile-color" style={baseStyle}>
      {TitleBlock}
    </Link>
  );
}
