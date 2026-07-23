import type { Metadata } from "next";
import Studio from "@/components/studio/Studio";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Free binaural beat and isochronic tone generator with adjustable carrier, background noise, guided journeys, and WAV export.",
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-3xl font-medium text-paper sm:text-4xl">
          Studio
        </h1>
        <p className="mt-2 max-w-2xl text-sage">
          Pick a preset or dial in your own beat. Audio is generated locally
          in your browser. Your settings and audio are not uploaded.
        </p>
      </div>
      <Studio />
    </div>
  );
}
