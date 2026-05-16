import Link from "next/link";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import type { Metadata } from "next";
import type {
  PINNED_PROJECTS_QUERY_RESULT,
  FEATURED_PROJECTS_QUERY_RESULT,
} from "@/sanity/sanity.types";

export const metadata: Metadata = {
  title: "BXRS - Portfolio",
  description: "Creative portfolio and projects",
};

const PROJECT_CARD_PROJECTION = `{
  _id,
  title,
  slug,
  shortDescription,
  cardBackgroundColor,
  cardTextColor,
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
  const [pinnedProjects, featuredProjects] = await Promise.all([
    client.fetch(PINNED_PROJECTS_QUERY, {}, options),
    client.fetch(FEATURED_PROJECTS_QUERY, {}, options),
  ]);

  return (
    <main className="container mx-auto min-h-screen max-w-7xl p-8">
      {pinnedProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {pinnedProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {featuredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {pinnedProjects.length === 0 && featuredProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-foreground/60">No projects to display yet.</p>
        </div>
      )}
    </main>
  );
}

type ProjectCardData =
  | PINNED_PROJECTS_QUERY_RESULT[number]
  | FEATURED_PROJECTS_QUERY_RESULT[number];

function ProjectCard({ project }: { project: ProjectCardData }) {
  const backgroundColor = project.cardBackgroundColor || "#FFFFFF";
  const textColor = project.cardTextColor || "#000000";

  return (
    <Link href={`/projx/${project.slug?.current}`}>
      <div
        className="aspect-square p-8 flex flex-col justify-center items-center text-center hover:opacity-90 transition-opacity"
        style={{ backgroundColor, color: textColor }}
      >
        <h2 className="text-2xl font-bold uppercase mb-4">{project.title}</h2>
        {project.shortDescription && (
          <p className="text-sm">{project.shortDescription}</p>
        )}
      </div>
    </Link>
  );
}
