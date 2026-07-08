import Link from "next/link";

const EXPLORE = [
  { href: "/studio", label: "Studio" },
  { href: "/frequency", label: "Frequency bands" },
  { href: "/uses", label: "Uses" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
];

export default function Footer({ variant }: { variant: "dark" | "light" }) {
  const dark = variant === "dark";
  const muted = "text-sage";
  const heading = dark ? "text-paper" : "text-ink";
  const link = dark
    ? "text-sage hover:text-gold transition-colors"
    : "text-sage hover:text-gold-deep transition-colors";

  return (
    <footer
      className={`border-t ${dark ? "border-paper/10" : "border-ink/10"}`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <p className={`font-display text-lg ${heading}`}>Binaural Studio</p>
          <p className={`mt-3 max-w-xs text-sm leading-relaxed ${muted}`}>
            Binaural beats are an exploratory listening tool — not a treatment,
            a cure, or medical advice. The research is genuinely mixed.{" "}
            <Link
              href="/research#disclaimer"
              className={dark ? "text-gold hover:underline" : "text-gold-deep hover:underline"}
            >
              Read what the science does and doesn&apos;t show
            </Link>
            .
          </p>
        </div>
        <div>
          <p className={`text-sm font-medium ${heading}`}>Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={`text-sm font-medium ${heading}`}>Connect</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className={link}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className={link}>
                Contact &amp; partnerships
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`border-t ${dark ? "border-paper/10" : "border-ink/10"}`}
      >
        <p className={`mx-auto max-w-6xl px-6 py-5 text-xs ${muted}`}>
          © {new Date().getFullYear()} Binaural Studio. Use headphones for
          binaural mode. Don&apos;t listen while driving.
        </p>
      </div>
    </footer>
  );
}
