import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { getBlogPosts, getEntry, type BlogData } from "@/lib/content";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getEntry<BlogData>("blog", slug);
  if (!post) return {};
  return {
    title: post.data.title,
    description: post.data.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getEntry<BlogData>("blog", slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      {post.data.date && (
        <p className="font-mono text-sm text-sage">
          {new Date(post.data.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
        </p>
      )}
      <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink">
        {post.data.title}
      </h1>
      <Markdown className="mt-8 max-w-none">{post.body}</Markdown>
    </article>
  );
}
