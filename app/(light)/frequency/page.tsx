import type { Metadata } from "next";
import Link from "next/link";
import WaveformArt from "@/components/WaveformArt";
import { getFrequencyBands } from "@/lib/content";

export const metadata: Metadata = {
  title: "Frequency Bands",
  description:
    "Delta, theta, alpha, beta, and gamma — what each brainwave band is, what the research associates it with, and how to try it in the studio.",
};

export default function FrequencyIndexPage() {
  const bands = getFrequencyBands();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
        Frequency bands
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">
        Brain activity is often described in five broad EEG bands, from the
        slow waves of deep sleep to the fast rhythms of intense focus.
        Binaural beats are usually tuned to sit inside one of these ranges.
        Here&apos;s what each band actually is — minus the mysticism.
      </p>

      <div className="mt-10 space-y-6">
        {bands.map((band) => (
          <Link
            key={band.slug}
            href={`/frequency/${band.slug}`}
            className="group block rounded-2xl border border-ink/15 bg-paper p-6 transition-colors hover:border-gold-deep"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl font-medium text-ink">
                {band.data.title}
              </h2>
              <span className="font-mono text-sm text-sage">
                {band.data.hzLow}–{band.data.hzHigh} Hz
              </span>
            </div>
            <div className="mt-3" aria-hidden="true">
              <WaveformArt
                beatFreq={Math.min((band.data.hzLow + band.data.hzHigh) / 2, 30)}
                stroke="#B99457"
                height={56}
                className="h-10 w-full"
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              {band.data.description}
            </p>
            <p className="mt-3 text-sm text-gold-deep">
              Explore {band.data.title.toLowerCase()}{" "}
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
