import { createClient } from "next-sanity";

// useCdn: production hits Sanity's CDN edge (~1 min freshness, faster).
// In dev, hit the live API so the artist sees edits without waiting for the
// edge cache to expire.
export const client = createClient({
  projectId: "izt9f0dq",
  dataset: "production",
  apiVersion: "2025-05-01",
  useCdn: process.env.NODE_ENV === "production",
});
