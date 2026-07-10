import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import ResearchCard from "@/components/ResearchCard";
import WaveformArt from "@/components/WaveformArt";
import {
  getEntry,
  getFrequencyBands,
  getResearchForBand,
  getUsesForBand,
  type FrequencyData,
} from "@/lib/content";

export function generateStaticParams() {
  return getFrequencyBands().map((band) => ({ slug: band.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const band = getEntry<FrequencyData>("frequency", slug);
  if (!band) return {};
  return {
    title: `${band.data.title} (${band.data.hzLow}–${band.data.hzHigh} Hz)`,
    description: band.data.description,
  };
}

export default async function FrequencyBandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const band = getEntry<FrequencyData>("frequency", slug);
  if (!band) notFound();

  const relatedUses = getUsesForBand(slug);
  const relatedResearch = getResearchForBand(slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="font-mono text-sm text-sage">
        {band.data.hzLow}–{band.data.hzHigh} Hz
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium text-ink">
        {band.data.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink/80">
        {band.data.description}
      </p>

      <div className="mt-8" aria-hidden="true">
        <WaveformArt
          beatFreq={Math.min((band.data.hzLow + band.data.hzHigh) / 2, 30)}
          stroke="#B99457"
          className="h-20 w-full"
        />
      </div>

      {band.body && <Markdown className="mt-8 max-w-none">{band.body}</Markdown>}

      <div className="mt-10 rounded-2xl border border-ink/15 p-6">
        <p className="text-sm text-ink/80">
          Want to hear it? The studio can generate a beat anywhere in the{" "}
          <span className="font-mono">
            {band.data.hzLow}–{band.data.hzHigh} Hz
          </span>{" "}
          range.
        </p>
        <Link
          href="/studio"
          className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold/90"
        >
          Open the Studio
        </Link>
      </div>

      {relatedUses.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-ink">
            Common uses
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedUses.map((use) => (
              <li key={use.slug}>
                <Link
                  href={`/uses/${use.slug}`}
                  className="block rounded-xl border border-ink/15 p-4 transition-colors hover:border-gold-deep"
                >
                  <span className="font-medium text-ink">{use.data.title}</span>
                  <span className="mt-1 block text-sm text-ink/70">
                    {use.data.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedResearch.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-ink">
            Related research
          </h2>
          <div className="mt-4 space-y-4">
            {relatedResearch.map((entry) => (
              <ResearchCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
