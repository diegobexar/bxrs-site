import { PortableText, defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { formatDate } from "@/lib/date";

const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  excerpt,
  body
}`);

const options = { next: { revalidate: 30 } };

function readingTime(body: unknown): string {
  if (!Array.isArray(body)) return "—";
  const words = body
    .map((block) => {
      if (block?._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children
        .map((c: { text?: string }) => c.text ?? "")
        .join(" ");
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} MIN`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug }, options);

  if (!post) {
    return (
      <main className="blog-post">
        <div className="crumb">
          <Link href="/blog">← STUDIO NOTES</Link>
        </div>
        <h1>Post not found</h1>
      </main>
    );
  }

  return (
    <main className="blog-post">
      <div className="crumb">
        <Link href="/blog">← STUDIO NOTES</Link>
      </div>

      {post.excerpt && <p className="eyebrow">{post.excerpt}</p>}
      <h1>{post.title}</h1>

      <div className="post-meta">
        <span>
          <strong>POSTED</strong>
          {formatDate(post.publishedAt)}
        </span>
        <span>
          <strong>READ</strong>
          {readingTime(post.body)}
        </span>
      </div>

      <div className="prose">
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>

      <div className="end">×</div>
    </main>
  );
}
