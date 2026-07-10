import type { Metadata } from "next";
import ResearchCard from "@/components/ResearchCard";
import { getResearch } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research",
  description:
    "A curated, plain-language feed of binaural beat studies — what they found, how strong the evidence is, and where it's genuinely mixed.",
};

export default function ResearchPage() {
  const research = getResearch();
  const featured = research.filter((entry) => entry.data.featured);
  const rest = research.filter((entry) => !entry.data.featured);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
        Research
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">
        Every entry here is a real, published study, summarized in our own
        words with a plain rating of how strong the evidence actually is.
        Binaural beats attract a lot of overclaiming — this page exists to do
        the opposite.
      </p>

      {featured.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-medium text-ink">
            Highlighted studies
          </h2>
          <div className="mt-4 space-y-4">
            {featured.map((entry) => (
              <ResearchCard key={entry.slug} entry={entry} featured />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-medium text-ink">
            All studies
          </h2>
          <div className="mt-4 space-y-4">
            {rest.map((entry) => (
              <ResearchCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      )}

      <section
        id="disclaimer"
        className="mt-14 scroll-mt-8 rounded-2xl border border-ink/15 bg-paper p-7"
      >
        <h2 className="font-display text-2xl font-medium text-ink">
          What this research does — and doesn&apos;t — show
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink/80">
          <p>
            Binaural beats are real as an auditory phenomenon: play slightly
            different frequencies into each ear and your auditory system
            perceives a rhythmic &ldquo;beat&rdquo; at the difference. Whether
            that reliably shifts brain activity, mood, or performance is a
            much harder question, and the honest answer is:{" "}
            <strong className="text-ink">sometimes, modestly, for some people, in some
            studies.</strong>
          </p>
          <p>
            Some controlled studies report small improvements in anxiety,
            attention, or relaxation. Others find no effect beyond ordinary
            music or silence. Sample sizes are often small, protocols vary
            wildly (frequency, duration, volume, carrier tones), and
            publication bias is a live concern. Meta-analyses suggest effects
            exist but are modest and inconsistent.
          </p>
          <p>
            So our position: binaural beats are a low-risk,{" "}
            <strong className="text-ink">exploratory listening practice</strong> — a way to
            structure attention and wind-down time — not a treatment. Nothing
            on this site is medical advice, and no frequency here cures,
            treats, or diagnoses anything. If you have a seizure disorder,
            wear a hearing implant, are pregnant, or have a heart condition,
            check with a clinician before using audio entrainment. Stop if
            you feel unwell, and never listen while driving or operating
            machinery.
          </p>
          <p>
            If a study on this page seems overstated, tell us — we&apos;d
            rather correct the feed than protect a claim.
          </p>
        </div>
      </section>
    </div>
  );
}
