import Link from "next/link";
import { getSiteSettings } from "@/sanity/queries";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  const social = settings?.socialLinks ?? [];
  const email = settings?.contactEmail;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wm-big">BXRS.ART</div>
      <div className="grid">
        <div className="col">
          <h4>WORK</h4>
          <ul>
            <li>
              <Link href="/">All projects</Link>
            </li>
          </ul>
        </div>
        <div className="col">
          <h4>WRITING</h4>
          <ul>
            <li>
              <Link href="/notes">Notes</Link>
            </li>
          </ul>
        </div>
        <div className="col">
          <h4>ELSEWHERE</h4>
          <ul>
            {social.length === 0 ? (
              <li>—</li>
            ) : (
              social.map((link) => (
                <li key={link._key}>
                  <a href={link.url ?? "#"} target="_blank" rel="noopener noreferrer">
                    {link.platform} ↗
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="col">
          <h4>CONTACT</h4>
          <ul>
            {email ? (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            ) : (
              <li>—</li>
            )}
            <li>
              <Link href="/info">Info</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="legal">
        <span>© {year} BXRS · ALL RIGHTS RESERVED</span>
        <span>HARD CORNERS &amp; PRIMARY COLORS</span>
      </div>
    </footer>
  );
}
