import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Filesystem content reader. Repository Markdown is the source of truth for
 * public editorial content, so the website does not need a CMS or database
 * connection at build time.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Entry<T> {
  slug: string;
  data: T;
  body: string;
}

export interface FrequencyData {
  title: string;
  hzLow: number;
  hzHigh: number;
  description: string;
}

export interface UseData {
  title: string;
  description: string;
  bands?: string[];
  relatedResearch?: { entry: string }[];
}

export interface ResearchData {
  title: string;
  sourceUrl: string;
  summary: string;
  bands?: string[];
  useCases?: string[];
  evidenceStrength?: "preliminary" | "mixed" | "moderate" | "strong";
  featured?: boolean;
  date?: string;
}

export type EditorialStatus =
  | "draft"
  | "in-review"
  | "approved"
  | "published"
  | "archived";

export interface AuthorData {
  name: string;
  slug?: string;
  role?: string;
  url?: string;
  bio?: string;
  expertise?: string[];
}

export interface EditorialDates {
  created?: string | Date;
  published?: string | Date | null;
  updated?: string | Date | null;
  reviewed?: string | Date | null;
  researchChecked?: string | Date | null;
}

export interface SeoData {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

export interface SocialImageData {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface SocialData {
  openGraph?: {
    title?: string;
    description?: string;
    image?: SocialImageData;
  };
  twitter?: {
    card?: "summary" | "summary_large_image";
    title?: string;
    description?: string;
    image?: SocialImageData;
  };
}

export interface CitationData {
  id: string;
  title: string;
  authors?: string[];
  year?: number;
  publication?: string;
  doi?: string;
  url: string;
  accessed?: string | Date;
  supports?: string[];
}

export interface StructuredDataConfig {
  type?: "Article" | "BlogPosting" | "TechArticle";
  about?: string[];
  mentions?: { name: string; url?: string }[];
}

export interface RelatedContentData {
  title: string;
  url: string;
  relationship?: string;
}

export interface BlogData {
  title: string;
  slug?: string;
  contentType?: "article" | "blog-post" | "guide" | "research-summary";
  status?: EditorialStatus;
  reviewStage?: string;
  summary?: string;
  excerpt?: string;
  author?: AuthorData | string;
  dates?: EditorialDates;
  /** Legacy field retained for existing posts. Prefer `dates.published`. */
  date?: string | Date;
  /** Legacy field retained for existing posts. Prefer `dates.updated`. */
  updated?: string | Date;
  category?: string;
  tags?: string[];
  featuredImage?: SocialImageData | string;
  seo?: SeoData;
  social?: SocialData;
  citations?: CitationData[];
  structuredData?: StructuredDataConfig;
  relatedContent?: RelatedContentData[];
  disclosures?: {
    aiAssisted?: boolean;
    aiUse?: string;
    expertReviewed?: boolean;
    expertReviewer?: string | null;
  };
}

export interface PageData {
  title: string;
}

export function getCollection<T>(collection: string): Entry<T>[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        data: data as T,
        body: content.trim(),
      };
    });
}

export function getEntry<T>(collection: string, slug: string): Entry<T> | null {
  return (
    getCollection<T>(collection).find((entry) => entry.slug === slug) ?? null
  );
}

/** Content relationships may use paths such as "content/research/foo.md". */
export function refToSlug(ref: string): string {
  const base = ref.split("/").pop() ?? ref;
  return base.replace(/\.mdx?$/, "");
}

export function getFrequencyBands(): Entry<FrequencyData>[] {
  return getCollection<FrequencyData>("frequency").sort(
    (a, b) => a.data.hzLow - b.data.hzLow
  );
}

export function getUses(): Entry<UseData>[] {
  return getCollection<UseData>("uses").sort((a, b) =>
    a.data.title.localeCompare(b.data.title)
  );
}

/** YAML may parse dates as strings or Date objects; compare as timestamps. */
function timeOf(value: unknown): number {
  if (!value) return 0;
  const time = new Date(value as string | Date).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function getResearch(): Entry<ResearchData>[] {
  return getCollection<ResearchData>("research").sort(
    (a, b) => timeOf(b.data.date) - timeOf(a.data.date)
  );
}

export function getBlogPosts(): Entry<BlogData>[] {
  return getCollection<BlogData>("blog")
    .filter((post) => !post.data.status || post.data.status === "published")
    .sort(
      (a, b) =>
        timeOf(b.data.dates?.published ?? b.data.date) -
        timeOf(a.data.dates?.published ?? a.data.date)
    );
}

/** Return only a publicly publishable blog entry. */
export function getBlogPost(slug: string): Entry<BlogData> | null {
  return getBlogPosts().find((post) => post.slug === slug) ?? null;
}

export function getPublishedDate(post: BlogData): string | Date | undefined {
  return post.dates?.published ?? post.date;
}

export function getUpdatedDate(post: BlogData): string | Date | undefined {
  return post.dates?.updated ?? post.updated ?? getPublishedDate(post);
}

/** Uses that list this band slug in their `bands` field. */
export function getUsesForBand(bandSlug: string): Entry<UseData>[] {
  return getUses().filter((use) => use.data.bands?.includes(bandSlug));
}

/** Research tagged with this band slug. */
export function getResearchForBand(bandSlug: string): Entry<ResearchData>[] {
  return getResearch().filter((item) => item.data.bands?.includes(bandSlug));
}

/** Research tagged with this use-case slug. */
export function getResearchForUse(useSlug: string): Entry<ResearchData>[] {
  return getResearch().filter((item) => item.data.useCases?.includes(useSlug));
}
