"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-lg border border-ink/20 bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-sage focus:border-gold-deep focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"), // honeypot
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof body.error === "string"
            ? body.error
            : "Something went wrong. Please try again."
        );
      }
      setStatus("sent");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-gold p-6" role="status">
        <p className="font-display text-xl text-ink">Message sent.</p>
        <p className="mt-2 text-sm text-ink/80">
          Thanks for reaching out — you&apos;ll hear back soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-ink/80">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={200}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-ink/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={320}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm text-ink/80">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          className={inputClass}
        />
      </div>
      {/* Honeypot — humans never see this field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold/90 disabled:cursor-wait disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-ink" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
