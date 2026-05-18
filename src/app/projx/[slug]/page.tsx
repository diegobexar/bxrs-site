import { cache } from "react";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { MultilineText } from "@/components/MultilineText";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { urlFor } from "@/sanity/image";

const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  title,
  description,
  lede,
  materials,
  year,
  categories,
  "cardBackgroundColor": cardBackgroundColor.hex,
  cardTextColor,
  content,
  seoTitle,
  seoDescription,
  seoImage {
    asset-> {
      _id,
      url
    }
  }
}`);

const options = { next: { revalidate: 30 } };

const getProject = cache(async (slug: string) =>
  client.fetch(PROJECT_QUERY, { slug }, options),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const seoImageUrl = project.seoImage
    ? urlFor(project.seoImage)?.width(1200).height(630).url()
    : null;

  const description = project.seoDescription || project.description || "";

  return {
    title: project.seoTitle || project.title || "Project",
    description,
    openGraph: {
      title: project.seoTitle || project.title || "Project",
      description,
      images: seoImageUrl ? [seoImageUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.seoTitle || project.title || "Project",
      description,
      images: seoImageUrl ? [seoImageUrl] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return (
      <main className="project">
        <div className="crumb">
          <Link href="/">← WORK</Link>
        </div>
        <h1>Project not found</h1>
      </main>
    );
  }

  const bg = project.cardBackgroundColor || undefined;
  const fg = project.cardTextColor || undefined;
  const pageStyle = (
    bg ? { "--page-bg": bg, "--page-fg": fg ?? "#111" } : {}
  ) as CSSProperties;

  const year = project.year ?? null;
  const categories = project.categories?.join(" · ");

  return (
    <main className="page color-page" style={pageStyle}>
      <div className="project">
        <div className="crumb">
          <Link href="/">← WORK</Link>
        </div>

        <h1>
          <MultilineText value={project.title} />
        </h1>

        <div className="meta">
          {year && (
            <div className="cell">
              <span className="k">Year</span>
              <span className="v">{year}</span>
            </div>
          )}
          {categories && (
            <div className="cell">
              <span className="k">Categories</span>
              <span className="v">{categories}</span>
            </div>
          )}
          {project.materials && (
            <div className="cell">
              <span className="k">Materials</span>
              <span className="v">{project.materials}</span>
            </div>
          )}
          {project.description && (
            <div className="cell">
              <span className="k">About</span>
              <span className="v">{project.description}</span>
            </div>
          )}
        </div>

        {project.lede && <p className="lede">{project.lede}</p>}
      </div>

      {project.content && <BlockRenderer blocks={project.content} />}
    </main>
  );
}
