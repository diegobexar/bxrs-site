import { createClient } from "next-sanity";

// useCdn off in dev so Studio edits appear without waiting for edge cache.
export const client = createClient({
  projectId: "izt9f0dq",
  dataset: "production",
  apiVersion: "2025-05-01",
  useCdn: process.env.NODE_ENV === "production",
});

// Shared ISR window for every Sanity read (list + detail). 30s keeps the
// artist's Studio edit-iteration loop snappy without re-fetching per request.
export const sanityFetch = { next: { revalidate: 30 } } as const;
