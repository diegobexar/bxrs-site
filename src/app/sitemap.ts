import type { MetadataRoute } from "next";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";

// Canonical origin. No env files in this project by design — see CLAUDE.md.
const BASE_URL = "https://bxrs.art";

const SITEMAP_QUERY = defineQuery(`{
  "projects": *[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`);

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, posts } = await client.fetch(SITEMAP_QUERY);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/notes`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/info`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((p) =>
    p.slug
      ? [
          {
            url: `${BASE_URL}/projx/${p.slug}`,
            lastModified: p._updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
        ]
      : [],
  );

  const postRoutes: MetadataRoute.Sitemap = posts.flatMap((p) =>
    p.slug
      ? [
          {
            url: `${BASE_URL}/notes/${p.slug}`,
            lastModified: p._updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : [],
  );

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
