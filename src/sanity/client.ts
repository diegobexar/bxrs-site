import { createClient } from "next-sanity";

// useCdn off in dev so Studio edits appear without waiting for edge cache.
export const client = createClient({
  projectId: "izt9f0dq",
  dataset: "production",
  apiVersion: "2025-05-01",
  useCdn: process.env.NODE_ENV === "production",
});
