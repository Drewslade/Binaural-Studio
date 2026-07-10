import Link from "next/link";
import WaveformArt from "@/components/WaveformArt";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <p className="font-mono text-sm text-sage">1–30 Hz · headphones on</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight text-paper sm:text-6xl">
          Precise, quiet tools for listening your way into a different state.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-sage">
          Binaural Studio is a free beat generator built on real oscillator
          math — with honest, research-aware guides instead of miracle claims.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/studio"
            className="rounded-full bg-gold px-7 py-3 font-medium text-ink transition-colors hover:bg-gold/90"
          >
            Open the Studio
          </Link>
          <Link
            href="/uses"
            className="rounded-full border border-paper/25 px-7 py-3 text-paper transition-colors hover:border-gold hover:text-gold"
          >
            Browse uses
          </Link>
        </div>
        <div className="mt-16" aria-hidden="true">
          <WaveformArt
            beatFreq={10}
            carrierFreq={220}
            stroke="#8A9186"
            className="h-24 w-full"
          />
        </div>
      </section>

      {/* Three doors */}
      <section className="grid gap-6 pb-24 sm:grid-cols-3">
        <Link
          href="/studio"
          className="group rounded-2xl border border-paper/10 bg-charcoal p-7 transition-colors hover:border-gold/60"
        >
          <p className="font-mono text-xs text-sage">01</p>
          <h2 className="mt-3 font-display text-2xl text-paper">Studio</h2>
          <p className="mt-3 text-sm leading-relaxed text-sage">
            Binaural beats and isochronic tones with adjustable carrier,
            background noise, guided journeys, and WAV export.
          </p>
          <p className="mt-5 text-sm text-gold">
            Start listening{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </p>
        </Link>
        <Link
          href="/uses"
          className="group rounded-2xl border border-paper/10 bg-charcoal p-7 transition-colors hover:border-gold/60"
        >
          <p className="font-mono text-xs text-sage">02</p>
          <h2 className="mt-3 font-display text-2xl text-paper">Uses</h2>
          <p className="mt-3 text-sm leading-relaxed text-sage">
            Focus, meditation, sleep, walking — practical guides that pair
            each intent with a frequency band and the studies behind it.
          </p>
          <p className="mt-5 text-sm text-gold">
            Find your use case{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </p>
        </Link>
        <Link
          href="/research"
          className="group rounded-2xl border border-paper/10 bg-charcoal p-7 transition-colors hover:border-gold/60"
        >
          <p className="font-mono text-xs text-sage">03</p>
          <h2 className="mt-3 font-display text-2xl text-paper">Research</h2>
          <p className="mt-3 text-sm leading-relaxed text-sage">
            A curated feed of actual studies — what they found, how strong the
            evidence is, and where it&apos;s genuinely mixed.
          </p>
          <p className="mt-5 text-sm text-gold">
            Read the evidence{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </p>
        </Link>
      </section>
    </div>
  );
}
