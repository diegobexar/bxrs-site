import { PortableText, type PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import type { CSSProperties } from "react";

interface BlockRendererProps {
  blocks: any[];
}

// Legacy Tailwind-named values (sm/md/lg/...) are kept in the alias list
// because the schema's pre-design-system rev stored them; existing documents
// would otherwise render at the fallback size.
const fontSizeMap: Record<string, string> = {
  "t-12": "var(--t-12)",
  "t-14": "var(--t-14)",
  "t-16": "var(--t-16)",
  "t-18": "var(--t-18)",
  "t-20": "var(--t-20)",
  "t-24": "var(--t-24)",
  "t-32": "var(--t-32)",
  "t-44": "var(--t-44)",
  "t-60": "var(--t-60)",
  "t-84": "var(--t-84)",
  "t-120": "var(--t-120)",
  // Legacy aliases
  sm: "var(--t-14)",
  md: "var(--t-16)",
  lg: "var(--t-18)",
  xl: "var(--t-20)",
  "2xl": "var(--t-24)",
  "3xl": "var(--t-32)",
  "4xl": "var(--t-44)",
  "5xl": "var(--t-60)",
  "6xl": "var(--t-84)",
};

const fontFamilyMap: Record<string, string> = {
  sans: "var(--font-sans)",
  serif: "var(--font-serif)",
  mono: "var(--font-mono)",
  display: "var(--font-display)",
};

const fontWeightMap: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 700,
  bold: 800,
};

const textAlignMap: Record<string, "left" | "center" | "right"> = {
  left: "left",
  center: "center",
  right: "right",
};

const textTransformMap: Record<
  string,
  "none" | "uppercase" | "lowercase" | "capitalize"
> = {
  none: "none",
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
};

const spacerHeightMap: Record<string, string> = {
  xs: "var(--space-4)",
  sm: "var(--space-6)",
  md: "var(--space-8)",
  lg: "var(--space-9)",
  xl: "var(--space-10)",
};

const colorBlockHeightMap: Record<string, string> = {
  sm: "100px",
  md: "200px",
  lg: "300px",
  xl: "400px",
  full: "100vh",
};

const paddingMap: Record<string, string> = {
  none: "0",
  sm: "var(--space-4)",
  md: "var(--space-6)",
  lg: "var(--space-7)",
};

const maxWidthMap: Record<string, string> = {
  full: "100%",
  "7xl": "80rem",
  "5xl": "64rem",
  "3xl": "48rem",
  xl: "36rem",
};

const alignMap: Record<string, CSSProperties> = {
  left: { marginRight: "auto", marginLeft: 0 },
  center: { marginLeft: "auto", marginRight: "auto" },
  right: { marginLeft: "auto", marginRight: 0 },
};

function pick<T>(
  map: Record<string, T>,
  value: string | undefined,
  fallback: T,
): T {
  if (value && value in map) return map[value];
  return fallback;
}

function layoutStyle(
  block: { maxWidth?: string; alignment?: string },
  defaultMaxWidth: string,
  defaultAlign: keyof typeof alignMap = "center",
): CSSProperties {
  return {
    width: "100%",
    maxWidth: pick(maxWidthMap, block.maxWidth, maxWidthMap[defaultMaxWidth]),
    ...pick(alignMap, block.alignment, alignMap[defaultAlign]),
  };
}

const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--link)",
          textDecoration: "underline",
          textDecorationThickness: 2,
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong style={{ fontWeight: 800 }}>{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
  },
};

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-0 w-full">
      {blocks.map((block, index) => {
        switch (block._type) {
          case "imageBlock":
            return <ImageBlock key={block._key || index} block={block} />;
          case "textBlock":
            return <TextBlock key={block._key || index} block={block} />;
          case "linkBlock":
            return <LinkBlock key={block._key || index} block={block} />;
          case "headingBlock":
            return <HeadingBlock key={block._key || index} block={block} />;
          case "colorBlock":
            return <ColorBlock key={block._key || index} block={block} />;
          case "spacerBlock":
            return <SpacerBlock key={block._key || index} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function ImageBlock({ block }: { block: any }) {
  const imageUrl = block.image ? urlFor(block.image)?.url() : null;
  const backgroundColor = block.backgroundColor || "transparent";
  const captionFamily = pick(
    fontFamilyMap,
    block.captionFontFamily,
    fontFamilyMap.mono,
  );
  const captionSize = pick(
    fontSizeMap,
    block.captionFontSize,
    "var(--t-12)",
  );
  const captionIsMono = (block.captionFontFamily ?? "mono") === "mono";

  const content = (
    <div
      style={{
        ...layoutStyle(block, "full"),
        position: "relative",
        backgroundColor,
      }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={block.caption || ""}
          width={1200}
          height={800}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes="100vw"
          priority={false}
        />
      )}
      {block.caption && (
        <p
          style={{
            fontFamily: captionFamily,
            fontSize: captionSize,
            letterSpacing: captionIsMono ? "0.06em" : undefined,
            textTransform: captionIsMono ? "uppercase" : undefined,
            color: "var(--fg-3)",
            margin: 0,
            padding: "8px 16px 16px",
          }}
        >
          {block.caption}
        </p>
      )}
    </div>
  );

  if (block.link) {
    return (
      <a
        href={block.link}
        target="_blank"
        rel="noopener noreferrer"
        className="bxrs-block-image"
      >
        {content}
      </a>
    );
  }

  return content;
}

function TextBlock({ block }: { block: any }) {
  const fontFamilyValue = block.fontFamily ?? "sans";
  const fontFamily = pick(fontFamilyMap, fontFamilyValue, fontFamilyMap.sans);
  const fontSize = pick(fontSizeMap, block.fontSize, "var(--t-16)");
  const fontWeight = pick(fontWeightMap, block.fontWeight, 400);
  const textTransform = pick(textTransformMap, block.textTransform, "none");
  const textAlign = pick(textAlignMap, block.textAlign, "left");
  const backgroundColor = block.backgroundColor || "transparent";

  // Serif fontFamily implies editorial prose: use the .prose class which
  // already styles links, blockquotes, h2/h3, drop-caps, etc. per design system.
  const isProse = fontFamilyValue === "serif";

  const baseStyle: CSSProperties = {
    ...layoutStyle(block, "3xl"),
    padding: "var(--space-7) var(--space-6)",
    backgroundColor,
    textAlign,
    textTransform,
  };

  if (isProse) {
    return (
      <div style={baseStyle}>
        <div className="prose">
          {block.content && (
            <PortableText
              value={block.content}
              components={portableComponents}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="bxrs-textblock"
      style={{
        ...baseStyle,
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight: "var(--lh-body)",
      }}
    >
      {block.content && (
        <PortableText value={block.content} components={portableComponents} />
      )}
    </div>
  );
}

function LinkBlock({ block }: { block: any }) {
  const backgroundColor = block.backgroundColor || "transparent";
  const titleFamily = pick(
    fontFamilyMap,
    block.titleFontFamily,
    fontFamilyMap.sans,
  );
  const titleSize = pick(fontSizeMap, block.titleFontSize, "var(--t-24)");
  const descFamily = pick(
    fontFamilyMap,
    block.descriptionFontFamily,
    fontFamilyMap.mono,
  );
  const descSize = pick(
    fontSizeMap,
    block.descriptionFontSize,
    "var(--t-12)",
  );
  const descIsMono = (block.descriptionFontFamily ?? "mono") === "mono";

  return (
    <a
      href={block.url}
      target={block.openInNewTab ? "_blank" : "_self"}
      rel={block.openInNewTab ? "noopener noreferrer" : ""}
      className="bxrs-block-link"
      style={{
        ...layoutStyle(block, "3xl"),
        padding: "var(--space-6)",
        backgroundColor,
      }}
    >
      <h3
        style={{
          fontFamily: titleFamily,
          fontSize: titleSize,
          marginBottom: 8,
        }}
      >
        {block.title}
        <span style={{ marginLeft: 8 }}>↗</span>
      </h3>
      {block.description && (
        <p
          style={{
            fontFamily: descFamily,
            fontSize: descSize,
            letterSpacing: descIsMono ? "0.04em" : undefined,
            margin: 0,
            color: "var(--fg-3)",
            textTransform: descIsMono ? "uppercase" : undefined,
          }}
        >
          {block.description}
        </p>
      )}
    </a>
  );
}

function HeadingBlock({ block }: { block: any }) {
  const level = (block.level || "h2") as "h1" | "h2" | "h3" | "h4";
  const HeadingTag = level;
  const backgroundColor = block.backgroundColor || "transparent";
  const textAlign = pick(textAlignMap, block.textAlign, "left");
  const textTransform = block.textTransform
    ? pick(textTransformMap, block.textTransform, "uppercase")
    : undefined;
  const fontSizeOverride = block.fontSize
    ? pick(fontSizeMap, block.fontSize, undefined as unknown as string)
    : undefined;
  const fontFamilyOverride = block.fontFamily
    ? pick(fontFamilyMap, block.fontFamily, undefined as unknown as string)
    : undefined;

  return (
    <div
      style={{
        ...layoutStyle(block, "7xl"),
        padding: "var(--space-7) var(--space-6)",
        backgroundColor,
        textAlign,
      }}
    >
      <HeadingTag
        style={{
          ...(fontSizeOverride ? { fontSize: fontSizeOverride } : {}),
          ...(fontFamilyOverride ? { fontFamily: fontFamilyOverride } : {}),
          ...(textTransform ? { textTransform } : {}),
        }}
      >
        {block.text}
      </HeadingTag>
    </div>
  );
}

function ColorBlock({ block }: { block: any }) {
  const height = pick(colorBlockHeightMap, block.height, "200px");
  const padding = pick(paddingMap, block.padding, "var(--space-6)");
  const backgroundColor = block.backgroundColor || "var(--bxrs-ink)";

  return (
    <div
      style={{
        ...layoutStyle(block, "full"),
        height,
        padding,
        backgroundColor,
      }}
    />
  );
}

function SpacerBlock({ block }: { block: any }) {
  const height = pick(spacerHeightMap, block.height, "var(--space-8)");

  return (
    <div
      style={{
        ...layoutStyle(block, "full"),
        height,
      }}
    />
  );
}
