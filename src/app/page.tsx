import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { Tile, type TileProject } from "@/components/Tile";
import type { Metadata } from "next";

const HOMEPAGE_INTRO_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  siteDescription
}`);

export async function generateMetadata(): Promise<Metadata> {
  const intro = await client.fetch(
    HOMEPAGE_INTRO_QUERY,
    {},
    { next: { revalidate: 30 } },
  );
  return {
    title: "BXRS — Work",
    description: intro?.siteDescription ?? undefined,
  };
}

const PROJECT_CARD_PROJECTION = `{
  _id,
  title,
  slug,
  description,
  "cardBackgroundColor": cardBackgroundColor.hex,
  cardTextColor,
  tileVariant,
  videoDuration,
  year,
  categories,
  "tileImageUrl": tileImage.asset->url,
  order
}`;

const PINNED_PROJECTS_QUERY = defineQuery(`*[
  _type == "project"
  && pinToTopRow == true
  && defined(slug.current)
]|order(order asc)[0...3]${PROJECT_CARD_PROJECTION}`);

const FEATURED_PROJECTS_QUERY = defineQuery(`*[
  _type == "project"
  && showOnHomepage == true
  && pinToTopRow != true
  && defined(slug.current)
]|order(order asc)${PROJECT_CARD_PROJECTION}`);

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const [pinnedProjects, featuredProjects, intro] = await Promise.all([
    client.fetch(PINNED_PROJECTS_QUERY, {}, options),
    client.fetch(FEATURED_PROJECTS_QUERY, {}, options),
    client.fetch(HOMEPAGE_INTRO_QUERY, {}, options),
  ]);

  const headlineLines = intro?.siteDescription?.split("\n") ?? [];

  return (
    <main className="home">
      {headlineLines.length > 0 && (
        <div className="intro">
          <h1>
            {headlineLines.map((line, i) => (
              <span key={i} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </h1>
        </div>
      )}

      {pinnedProjects.length > 0 && (
        <div className="tile-grid pinned">
          {pinnedProjects.map((project, i) => (
            <Tile
              key={project._id}
              project={project as TileProject}
              index={i}
            />
          ))}
        </div>
      )}

      {featuredProjects.length > 0 && (
        <div className="tile-grid">
          {featuredProjects.map((project, i) => (
            <Tile
              key={project._id}
              project={project as TileProject}
              index={pinnedProjects.length + i}
            />
          ))}
        </div>
      )}

      {pinnedProjects.length === 0 && featuredProjects.length === 0 && (
        <p className="eyebrow">No projects to display yet.</p>
      )}
    </main>
  );
}
