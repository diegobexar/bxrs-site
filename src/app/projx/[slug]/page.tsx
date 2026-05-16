import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/image";

const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  ...,
  seoImage {
    asset-> {
      _id,
      url
    }
  }
}`);

const options = { next: { revalidate: 3600 } };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = await client.fetch(PROJECT_QUERY, await params, options);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const seoImageUrl = project.seoImage
    ? urlFor(project.seoImage)?.width(1200).height(630).url()
    : null;

  return {
    title: project.seoTitle || project.title || "Project",
    description: project.seoDescription || project.shortDescription || "",
    openGraph: {
      title: project.seoTitle || project.title || "Project",
      description: project.seoDescription || project.shortDescription || "",
      images: seoImageUrl ? [seoImageUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.seoTitle || project.title || "Project",
      description: project.seoDescription || project.shortDescription || "",
      images: seoImageUrl ? [seoImageUrl] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = await client.fetch(PROJECT_QUERY, await params, options);

  if (!project) {
    return (
      <main className="container mx-auto min-h-screen max-w-7xl p-8">
        <Link href="/" className="hover:underline">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Project not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-8 py-8">
        <Link href="/" className="hover:underline mb-8 inline-block">
          ← Back to home
        </Link>
      </div>

      {project.content && <BlockRenderer blocks={project.content} />}
    </main>
  );
}
