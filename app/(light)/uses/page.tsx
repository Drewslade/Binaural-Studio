import type { Metadata } from "next";
import Link from "next/link";
import { getUses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "Practical guides for using binaural beats — focus, meditation, sleep, relaxation, and walking — each paired with a frequency band and the research behind it.",
};

export default function UsesIndexPage() {
  const uses = getUses();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
        Uses
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">
        Start from what you&apos;re trying to do, not from a frequency chart.
        Each guide pairs an everyday intent with a sensible band, cites the
        relevant research, and links you into the studio.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {uses.map((use) => (
          <Link
            key={use.slug}
            href={`/uses/${use.slug}`}
            className="group rounded-2xl border border-ink/15 bg-paper p-6 transition-colors hover:border-gold-deep"
          >
            <h2 className="font-display text-2xl font-medium text-ink">
              {use.data.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              {use.data.description}
            </p>
            {use.data.bands && use.data.bands.length > 0 && (
              <p className="mt-4 flex flex-wrap gap-2 text-xs">
                {use.data.bands.map((band) => (
                  <span
                    key={band}
                    className="rounded-full border border-ink/20 px-2.5 py-0.5 capitalize text-ink/70"
                  >
                    {band}
                  </span>
                ))}
              </p>
            )}
            <p className="mt-4 text-sm text-gold-deep">
              Read the guide{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
