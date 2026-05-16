import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";

const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  infoContent,
  socialLinks,
  contactEmail
}`);

const INFO_METADATA_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{siteTitle, siteDescription}`
);

const options = { next: { revalidate: 30 } };

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(INFO_METADATA_QUERY, {}, options);

  return {
    title: settings?.siteTitle ? `${settings.siteTitle} - Info` : "Info",
    description: settings?.siteDescription || "Information and contact",
  };
}

export default async function InfoPage() {
  const settings = await client.fetch(SETTINGS_QUERY, {}, options);

  if (!settings) {
    return (
      <main className="container mx-auto min-h-screen max-w-7xl p-8">
        <h1 className="text-4xl font-bold mb-8">Info</h1>
        <p>No info content available yet.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen max-w-7xl p-8">
      {settings.infoContent && settings.infoContent.length > 0 ? (
        <BlockRenderer blocks={settings.infoContent} />
      ) : (
        <div className="container mx-auto max-w-7xl p-8">
          <h1 className="text-4xl font-bold mb-8">{settings.siteTitle}</h1>
          {settings.siteDescription && (
            <p className="text-lg mb-8">{settings.siteDescription}</p>
          )}

          {settings.socialLinks && settings.socialLinks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Connect</h2>
              <ul className="flex flex-col gap-2">
                {settings.socialLinks.map((link: any, index: number) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {settings.contactEmail && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact</h2>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="hover:underline"
              >
                {settings.contactEmail}
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
