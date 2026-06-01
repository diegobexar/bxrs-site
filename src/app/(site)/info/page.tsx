import { cache } from "react";
import { defineQuery, PortableText } from "next-sanity";
import Image from "next/image";
import { client } from "@/sanity/client";
import { getSiteSettings } from "@/sanity/queries";
import type { Metadata } from "next";

const INFO_QUERY = defineQuery(`*[_type == "info"][0]{
  title,
  featureImage {
    asset-> {
      _id,
      url,
      metadata { dimensions { width, height } }
    }
  },
  bio,
  contactLabel,
  contactEmail,
  stacks[]{
    heading,
    rows[]{label, value}
  }
}`);

const options = { next: { revalidate: 30 } };

const getInfo = cache(async () => client.fetch(INFO_QUERY, {}, options));

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings?.siteTitle ? `${settings.siteTitle} — Info` : "Info",
    description: settings?.siteDescription || "Info — BXRS.ART",
  };
}

export default async function InfoPage() {
  const [info, settings] = await Promise.all([getInfo(), getSiteSettings()]);

  const title = info?.title ?? "INFO.";
  const bio = info?.bio;
  const stacks = info?.stacks;
  const contactEmail = info?.contactEmail || settings?.contactEmail;
  const contactLabel = info?.contactLabel || "WRITE TO ME →";

  const featureImage = info?.featureImage;
  const featureDims = featureImage?.asset?.metadata?.dimensions;

  return (
    <main className="about">
      <div>
        {featureImage?.asset?.url && featureDims?.width && featureDims.height && (
          <figure className="feature-image">
            <Image
              src={featureImage.asset.url}
              alt={title}
              width={featureDims.width}
              height={featureDims.height}
              sizes="(min-width: 1024px) 480px, (min-width: 760px) 50vw, 100vw"
              priority
            />
          </figure>
        )}

        <h1>{title}</h1>

        {Array.isArray(bio) && bio.length > 0 && (
          <div className="bio">
            <PortableText value={bio} />
          </div>
        )}

        {contactEmail && (
          <a className="contact-btn" href={`mailto:${contactEmail}`}>
            {contactLabel}
          </a>
        )}
      </div>

      {stacks && stacks.length > 0 && (
        <div>
          {stacks.map((stack, i) => (
            <div
              className="col"
              key={stack?.heading ?? i}
              style={i > 0 ? { marginTop: 32 } : undefined}
            >
              {stack?.heading && <h3>{stack.heading}</h3>}
              <div className="stack">
                {stack?.rows?.map((row, j) => (
                  <div className="row" key={`${row?.label}-${j}`}>
                    <span>{row?.label}</span>
                    <span>{row?.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
