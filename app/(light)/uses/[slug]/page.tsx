import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import ResearchCard from "@/components/ResearchCard";
import {
  getEntry,
  getResearch,
  getResearchForUse,
  getUses,
  refToSlug,
  type FrequencyData,
  type UseData,
} from "@/lib/content";

export function generateStaticParams() {
  return getUses().map((use) => ({ slug: use.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const use = getEntry<UseData>("uses", slug);
  if (!use) return {};
  return {
    title: `${use.data.title} with Binaural Beats`,
    description: use.data.description,
  };
}

export default async function UsePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const use = getEntry<UseData>("uses", slug);
  if (!use) notFound();

  // Explicitly linked studies first; fall back to tag matches.
  const linkedSlugs = (use.data.relatedResearch ?? []).map((ref) =>
    refToSlug(ref.entry)
  );
  const allResearch = getResearch();
  const linked = linkedSlugs
    .map((researchSlug) => allResearch.find((r) => r.slug === researchSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const citations = linked.length > 0 ? linked : getResearchForUse(slug);

  const bands = (use.data.bands ?? [])
    .map((bandSlug) => getEntry<FrequencyData>("frequency", bandSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl font-medium text-ink">
        {use.data.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink/80">
        {use.data.description}
      </p>

      {bands.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {bands.map((band) => (
            <Link
              key={band.slug}
              href={`/frequency/${band.slug}`}
              className="rounded-full border border-ink/20 px-4 py-1.5 text-sm text-ink/80 transition-colors hover:border-gold-deep hover:text-gold-deep"
            >
              {band.data.title}{" "}
              <span className="font-mono text-xs text-sage">
                {band.data.hzLow}–{band.data.hzHigh} Hz
              </span>
            </Link>
          ))}
        </div>
      )}

      {use.body && <Markdown className="mt-8 max-w-none">{use.body}</Markdown>}

      <div className="mt-10 rounded-2xl border border-ink/15 p-6">
        <p className="text-sm text-ink/80">
          Ready to try it? Open the studio and dial in the settings from this
          guide.
        </p>
        <Link
          href="/studio"
          className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold/90"
        >
          Open the Studio
        </Link>
      </div>

      {citations.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-ink">
            Research worth reading
          </h2>
          <div className="mt-4 space-y-4">
            {citations.map((entry) => (
              <ResearchCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
