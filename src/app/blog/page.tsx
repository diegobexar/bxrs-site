import Link from "next/link";
import { defineQuery } from "next-sanity";

import { client } from "@/sanity/client";

const POSTS_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`);

const options = { next: { revalidate: 30 } };

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/blog/${post.slug?.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              {post.publishedAt && (
                <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
