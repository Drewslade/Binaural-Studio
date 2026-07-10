import type { Metadata } from "next";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import { getEntry, type PageData } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Binaural Studio exists: one person's attempt to build an honest, hype-free tool for exploratory listening.",
};

export default function AboutPage() {
  const page = getEntry<PageData>("pages", "about");

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
        {page?.data.title ?? "About"}
      </h1>
      {page && <Markdown className="mt-8 max-w-none">{page.body}</Markdown>}
      <div className="mt-10 rounded-2xl border border-ink/15 p-6">
        <h2 className="font-display text-xl font-medium text-ink">
          Partnerships &amp; inquiries
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/80">
          Interested in collaborating, licensing audio, or something else
          entirely? Get in touch — the form goes straight to my inbox.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold/90"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
