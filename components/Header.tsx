"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/studio", label: "Studio" },
  { href: "/frequency", label: "Frequency" },
  { href: "/uses", label: "Uses" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Header({ variant }: { variant: "dark" | "light" }) {
  const pathname = usePathname();
  const dark = variant === "dark";

  const linkBase = "text-sm transition-colors";
  const idle = dark
    ? "text-sage hover:text-paper"
    : "text-sage hover:text-ink";
  const active = dark
    ? "text-gold"
    : "text-gold-deep font-medium";

  return (
    <header
      className={`border-b ${
        dark ? "border-paper/10" : "border-ink/10"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
        <Link
          href="/"
          className={`font-display text-xl tracking-tight ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          Binaural Studio
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {NAV.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`${linkBase} ${isActive ? active : idle}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/contact"
          className={`ml-auto rounded-full border px-4 py-1.5 text-sm transition-colors ${
            pathname === "/contact"
              ? dark
                ? "border-gold text-gold"
                : "border-gold-deep text-gold-deep"
              : dark
                ? "border-paper/25 text-paper hover:border-gold hover:text-gold"
                : "border-ink/25 text-ink hover:border-gold-deep hover:text-gold-deep"
          }`}
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
