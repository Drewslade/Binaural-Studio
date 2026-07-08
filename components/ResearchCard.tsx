import Link from "next/link";
import type { Entry, ResearchData } from "@/lib/content";

const STRENGTH_LABELS: Record<string, string> = {
  preliminary: "Preliminary evidence",
  mixed: "Mixed evidence",
  moderate: "Moderate evidence",
  strong: "Strong evidence",
};

export default function ResearchCard({
  entry,
  featured = false,
}: {
  entry: Entry<ResearchData>;
  featured?: boolean;
}) {
  const { data } = entry;
  return (
    <article
      className={`rounded-2xl border bg-paper p-6 ${
        featured ? "border-gold" : "border-ink/15"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {data.evidenceStrength && (
          <span className="rounded-full border border-ink/20 px-2.5 py-0.5 text-ink/70">
            {STRENGTH_LABELS[data.evidenceStrength] ?? data.evidenceStrength}
          </span>
        )}
        {data.bands?.map((band) => (
          <Link
            key={band}
            href={`/frequency/${band}`}
            className="rounded-full border border-ink/20 px-2.5 py-0.5 capitalize text-ink/70 transition-colors hover:border-gold-deep hover:text-gold-deep"
          >
            {band}
          </Link>
        ))}
        {data.useCases?.map((useCase) => (
          <Link
            key={useCase}
            href={`/uses/${useCase}`}
            className="rounded-full border border-ink/20 px-2.5 py-0.5 capitalize text-ink/70 transition-colors hover:border-gold-deep hover:text-gold-deep"
          >
            {useCase}
          </Link>
        ))}
      </div>
      <h3 className="mt-3 font-display text-xl font-medium leading-snug text-ink">
        {data.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">{data.summary}</p>
      <a
        href={data.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-gold-deep hover:underline"
      >
        Read the study ↗
      </a>
    </article>
  );
}
