"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "WORK" },
  { href: "/blog", label: "STUDIO NOTES" },
  { href: "/info", label: "ABOUT" },
] as const;

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav>
      {ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "active" : ""}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
