import Link from "next/link";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="wm">
        BXRS.ART
      </Link>
      <NavLinks />
    </header>
  );
}
