"use client";

import { useEffect, useState } from "react";
import type { MarkdownHeading } from "@/components/Markdown";

function ContentsLinks({
  headings,
  activeId,
}: {
  headings: MarkdownHeading[];
  activeId: string;
}) {
  return (
    <ol className="mt-3 space-y-1.5">
      {headings.map((heading) => {
        const active = heading.id === activeId;
        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active ? "location" : undefined}
              className={`block border-l-2 py-1 pl-3 text-sm leading-snug transition-colors ${
                active
                  ? "border-gold text-ink"
                  : "border-transparent text-ink/60 hover:border-ink/25 hover:text-ink"
              }`}
            >
              {heading.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export default function TableOfContents({
  headings,
  variant,
}: {
  headings: MarkdownHeading[];
  variant: "desktop" | "mobile";
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -72% 0px" }
    );

    const sections = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((section): section is HTMLElement => Boolean(section));
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 4) return null;

  if (variant === "mobile") {
    return (
      <details className="mt-8 rounded-xl border border-ink/15 bg-paper/60 px-4 py-3 xl:hidden">
        <summary className="cursor-pointer font-mono text-sm text-ink">
          On this page
        </summary>
        <nav aria-label="Article sections">
          <ContentsLinks headings={headings} activeId={activeId} />
        </nav>
      </details>
    );
  }

  return (
    <nav
      aria-label="Article sections"
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] self-start overflow-y-auto pr-2 xl:block"
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-sage">
        On this page
      </p>
      <ContentsLinks headings={headings} activeId={activeId} />
    </nav>
  );
}
