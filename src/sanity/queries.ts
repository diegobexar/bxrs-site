import { cache } from "react";
import { defineQuery } from "next-sanity";
import { client, sanityFetch } from "./client";

// Shared per-request fetchers. Wrapping with React `cache()` deduplicates
// calls within a single render — so SiteFooter (mounted in layout) and any
// page calling these collapse into one Sanity round-trip.

const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  socialLinks,
  contactEmail
}`);

export const getSiteSettings = cache(async () =>
  client.fetch(SITE_SETTINGS_QUERY, {}, sanityFetch),
);
