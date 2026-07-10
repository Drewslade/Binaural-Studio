import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Filesystem content reader. TinaCMS edits these same markdown files (see
 * tina/config.ts), so pages render straight from the repo — no CMS API
 * needed at build time.
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

export interface BlogData {
  title: string;
  date: string;
  excerpt?: string;
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

/** Tina reference values look like "content/research/foo.md". */
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
  return getCollection<BlogData>("blog").sort(
    (a, b) => timeOf(b.data.date) - timeOf(a.data.date)
  );
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
