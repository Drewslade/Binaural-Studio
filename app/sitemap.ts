import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getFrequencyBands,
  getUpdatedDate,
  getUses,
} from "@/lib/content";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://binaural-studio.com"
).replace(/\/$/, "");
const SITE_UPDATED_AT = new Date("2026-07-10T00:00:00.000Z");

type SitemapEntry = MetadataRoute.Sitemap[number];
type SitemapOptions = Pick<
  SitemapEntry,
  "changeFrequency" | "lastModified" | "priority"
>;

function toUrl(pathname: string): string {
  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}

function toDate(value: string | Date | undefined): Date {
  if (!value) return SITE_UPDATED_AT;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? SITE_UPDATED_AT : date;
}

function entry(pathname: string, options: SitemapOptions): SitemapEntry {
  return {
    url: toUrl(pathname),
    lastModified: options.lastModified ?? SITE_UPDATED_AT,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { pathname: "/", changeFrequency: "weekly", priority: 1 },
    { pathname: "/studio", changeFrequency: "monthly", priority: 0.95 },
    { pathname: "/frequency", changeFrequency: "monthly", priority: 0.8 },
    { pathname: "/uses", changeFrequency: "monthly", priority: 0.8 },
    { pathname: "/research", changeFrequency: "monthly", priority: 0.75 },
    { pathname: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { pathname: "/about", changeFrequency: "yearly", priority: 0.45 },
    { pathname: "/contact", changeFrequency: "yearly", priority: 0.35 },
  ] satisfies Array<{ pathname: string } & SitemapOptions>;

  const bands = getFrequencyBands().map((band) =>
    entry(`/frequency/${band.slug}`, {
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );
  const uses = getUses().map((use) =>
    entry(`/uses/${use.slug}`, {
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );
  const posts = getBlogPosts().map((post) =>
    entry(`/blog/${post.slug}`, {
      lastModified: toDate(getUpdatedDate(post.data)),
      changeFrequency: "monthly",
      priority: 0.65,
    })
  );

  return [
    ...staticRoutes.map(({ pathname, ...options }) => entry(pathname, options)),
    ...bands,
    ...uses,
    ...posts,
  ];
}
