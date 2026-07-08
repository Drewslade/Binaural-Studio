import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on sound, attention, and building Binaural Studio.",
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
        Blog
      </h1>
      <p className="mt-3 leading-relaxed text-ink/80">
        Notes on sound, attention, and building this site.
      </p>

      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-ink/15 bg-paper p-6 transition-colors hover:border-gold-deep"
          >
            {post.data.date && (
              <p className="font-mono text-xs text-sage">
                {formatDate(post.data.date)}
              </p>
            )}
            <h2 className="mt-2 font-display text-2xl font-medium text-ink">
              {post.data.title}
            </h2>
            {post.data.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                {post.data.excerpt}
              </p>
            )}
            <p className="mt-4 text-sm text-gold-deep">
              Read post{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </p>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-sage">Nothing here yet — soon.</p>
        )}
      </div>
    </div>
  );
}
