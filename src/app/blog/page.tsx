import Link from "next/link";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { formatDate } from "@/lib/date";

const POSTS_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, excerpt}`);

const options = { next: { revalidate: 30 } };

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <main className="blog-index">
      <h1>Studio Notes</h1>
      <p className="lede">Writing on practice, materials, and process.</p>

      {posts.length === 0 ? (
        <p className="eyebrow">No notes yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {posts.map((post) => (
            <li key={post._id}>
              <Link
                href={`/blog/${post.slug?.current}`}
                className="post-item"
                style={{ color: "inherit" }}
              >
                <span className="post-date">{formatDate(post.publishedAt)}</span>
                <span>
                  <span className="post-title">{post.title}</span>
                  {post.excerpt && (
                    <span className="post-blurb" style={{ display: "block" }}>
                      {post.excerpt}
                    </span>
                  )}
                </span>
                <span className="post-read">Read ↗</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
