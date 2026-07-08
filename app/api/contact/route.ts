import { NextResponse } from "next/server";

const DEFAULT_TO = "drew@digitalmiddleground.com";
const DEFAULT_FROM = "Binaural Studio <onboarding@resend.dev>";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message, website } = (payload ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot filled → almost certainly a bot. Pretend success.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    name.trim().length === 0 ||
    message.trim().length === 0 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "Please fill in a valid name, email, and message." },
      { status: 400 }
    );
  }

  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return NextResponse.json({ error: "Message too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The contact form isn't wired up yet — email drew@digitalmiddleground.com directly.",
      },
      { status: 503 }
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM,
      to: [process.env.CONTACT_TO_EMAIL ?? DEFAULT_TO],
      reply_to: email,
      subject: `Binaural Studio contact form — ${name.trim()}`,
      text: `From: ${name.trim()} <${email}>\n\n${message.trim()}`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error:", res.status, await res.text());
    return NextResponse.json(
      { error: "Sending failed on our end. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
