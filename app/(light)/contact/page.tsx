import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions, corrections, partnership inquiries — send a message to Binaural Studio.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
        Contact
      </h1>
      <p className="mt-3 leading-relaxed text-ink/80">
        Questions about the studio, a correction for the research feed, or a
        partnership idea — all of it lands in the same inbox, and all of it
        gets read.
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
