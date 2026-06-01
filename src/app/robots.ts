import type { MetadataRoute } from "next";

const BASE_URL = "https://bxrs.art";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The embedded Sanity Studio is auth-gated; keep it out of the index.
      disallow: "/studio",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
