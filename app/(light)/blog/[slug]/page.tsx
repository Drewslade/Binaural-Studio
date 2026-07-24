import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import {
  getBlogPost,
  getBlogPosts,
  getPublishedDate,
  getUpdatedDate,
  type AuthorData,
  type BlogData,
  type SocialImageData,
} from "@/lib/content";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://binaural-studio.com"
).replace(/\/$/, "");

function absoluteUrl(value: string | undefined, fallback: string): string {
  if (!value) return `${SITE_URL}${fallback}`;
  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return `${SITE_URL}${fallback}`;
  }
}

function isoDate(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function authorData(author: BlogData["author"]): AuthorData | undefined {
  if (!author) return undefined;
  return typeof author === "string" ? { name: author } : author;
}

function imageData(image: BlogData["featuredImage"]): SocialImageData | undefined {
  if (!image) return undefined;
  return typeof image === "string" ? { url: image } : image;
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const description =
    post.data.seo?.description ?? post.data.summary ?? post.data.excerpt;
  const canonical = absoluteUrl(post.data.seo?.canonical, `/blog/${slug}`);
  const author = authorData(post.data.author);
  const publishedTime = isoDate(getPublishedDate(post.data));
  const modifiedTime = isoDate(getUpdatedDate(post.data));
  const featuredImage =
    post.data.social?.openGraph?.image ?? imageData(post.data.featuredImage);
  const twitterImage = post.data.social?.twitter?.image ?? featuredImage;

  return {
    title: post.data.seo?.title ?? post.data.title,
    description,
    alternates: { canonical },
    robots: post.data.seo?.robots,
    authors: author
      ? [{ name: author.name, url: absoluteUrl(author.url, "/about") }]
      : undefined,
    openGraph: {
      type: "article",
      title:
        post.data.social?.openGraph?.title ??
        post.data.seo?.title ??
        post.data.title,
      description:
        post.data.social?.openGraph?.description ?? description,
      url: canonical,
      publishedTime,
      modifiedTime,
      authors: author ? [author.name] : undefined,
      section: post.data.category,
      tags: post.data.tags,
      images: featuredImage
        ? [
            {
              url: absoluteUrl(featuredImage.url, featuredImage.url),
              alt: featuredImage.alt,
              width: featuredImage.width,
              height: featuredImage.height,
            },
          ]
        : undefined,
    },
    twitter: {
      card: post.data.social?.twitter?.card ?? "summary_large_image",
      title:
        post.data.social?.twitter?.title ??
        post.data.seo?.title ??
        post.data.title,
      description: post.data.social?.twitter?.description ?? description,
      images: twitterImage
        ? [absoluteUrl(twitterImage.url, twitterImage.url)]
        : undefined,
    },
  };
}

function articleJsonLd(post: BlogData, slug: string) {
  const author = authorData(post.author);
  const description = post.seo?.description ?? post.summary ?? post.excerpt;
  const canonical = absoluteUrl(post.seo?.canonical, `/blog/${slug}`);
  const featuredImage = imageData(post.featuredImage);

  return {
    "@context": "https://schema.org",
    "@type": post.structuredData?.type ?? "Article",
    headline: post.title,
    description,
    mainEntityOfPage: canonical,
    datePublished: isoDate(getPublishedDate(post)),
    dateModified: isoDate(getUpdatedDate(post)),
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          url: absoluteUrl(author.url, "/about"),
          jobTitle: author.role,
          knowsAbout: author.expertise,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Binaural Studio",
      url: SITE_URL,
    },
    image: featuredImage
      ? absoluteUrl(featuredImage.url, featuredImage.url)
      : undefined,
    articleSection: post.category,
    keywords: post.tags,
    about: post.structuredData?.about?.map((name) => ({
      "@type": "Thing",
      name,
    })),
    mentions: post.structuredData?.mentions?.map((item) => ({
      "@type": "Thing",
      name: item.name,
      sameAs: item.url,
    })),
    citation: post.citations?.map((citation) => citation.url),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const author = authorData(post.data.author);
  const published = getPublishedDate(post.data);
  const updated = getUpdatedDate(post.data);
  const jsonLd = JSON.stringify(articleJsonLd(post.data, slug)).replace(
    /</g,
    "\\u003c"
  );

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {published && (
        <p className="font-mono text-sm text-sage">
          Published {formatDate(published)}
          {updated && isoDate(updated) !== isoDate(published)
            ? ` · Updated ${formatDate(updated)}`
            : ""}
        </p>
      )}
      <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink">
        {post.data.title}
      </h1>

      {author && (
        <div className="mt-5 border-l-2 border-gold pl-4 text-sm text-ink/75">
          <p>
            By{" "}
            {author.url ? (
              <Link className="text-gold-deep underline" href={author.url}>
                {author.name}
              </Link>
            ) : (
              author.name
            )}
            {author.role ? `, ${author.role}` : ""}
          </p>
          {author.bio && <p className="mt-1 leading-relaxed">{author.bio}</p>}
        </div>
      )}

      <Markdown className="mt-8 max-w-none">{post.body}</Markdown>

      {post.data.relatedContent && post.data.relatedContent.length > 0 && (
        <aside className="mt-12 border-t border-ink/15 pt-8">
          <h2 className="font-display text-2xl font-medium text-ink">
            Related content
          </h2>
          <ul className="mt-4 space-y-3">
            {post.data.relatedContent.map((item) => (
              <li key={item.url}>
                <Link className="text-gold-deep underline" href={item.url}>
                  {item.title}
                </Link>
                {item.relationship ? (
                  <span className="ml-2 text-sm text-sage">
                    {item.relationship}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {post.data.disclosures?.aiAssisted && (
        <aside className="mt-10 rounded-xl border border-ink/15 bg-paper p-5 text-sm text-ink/75">
          <h2 className="font-medium text-ink">AI transparency</h2>
          <p className="mt-1 leading-relaxed">
            {post.data.disclosures.aiUse ??
              "AI tools assisted with research organization and drafting."}
          </p>
          {!post.data.disclosures.expertReviewed && (
            <p className="mt-1 leading-relaxed">
              This article has not received external expert review.
            </p>
          )}
        </aside>
      )}
    </article>
  );
}
