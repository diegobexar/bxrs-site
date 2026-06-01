import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { Tile, type TileProject } from "@/components/Tile";
import { MultilineText } from "@/components/MultilineText";
import { getSiteSettings } from "@/sanity/queries";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "BXRS — Work",
    description: settings?.siteDescription ?? undefined,
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
  "tileImageUrl": tileImage.asset->url
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
]|order(coalesce(year, 0) desc, order asc)${PROJECT_CARD_PROJECTION}`);

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const [pinnedProjects, featuredProjects, settings] = await Promise.all([
    client.fetch(PINNED_PROJECTS_QUERY, {}, options),
    client.fetch(FEATURED_PROJECTS_QUERY, {}, options),
    getSiteSettings(),
  ]);

  const headline = settings?.siteDescription;

  return (
    <main className="home">
      {headline && (
        <div className="intro">
          <h1>
            <MultilineText value={headline} />
          </h1>
        </div>
      )}

      {pinnedProjects.length > 0 && (
        <div className="tile-grid pinned">
          {pinnedProjects.map((project) => (
            <Tile key={project._id} project={project as TileProject} />
          ))}
        </div>
      )}

      {featuredProjects.length > 0 && (
        <div className="tile-grid">
          {featuredProjects.map((project) => (
            <Tile key={project._id} project={project as TileProject} />
          ))}
        </div>
      )}

      {pinnedProjects.length === 0 && featuredProjects.length === 0 && (
        <p className="eyebrow">No projects to display yet.</p>
      )}
    </main>
  );
}
