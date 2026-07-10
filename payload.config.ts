import { postgresAdapter } from "@payloadcms/db-postgres";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Frequency } from "./collections/Frequency";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Research } from "./collections/Research";
import { Users } from "./collections/Users";
import { Uses } from "./collections/Uses";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://binaural-studio.com";

const payloadSecret =
  process.env.PAYLOAD_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "dev-payload-secret-change-me");

function textField(doc: unknown, field: string): string | undefined {
  const value = (doc as Record<string, unknown> | undefined)?.[field];
  return typeof value === "string" ? value : undefined;
}

function uploadReference(doc: unknown, field: string): string | number | { id: string | number } {
  const value = (doc as Record<string, unknown> | undefined)?.[field];
  if (typeof value === "string" || typeof value === "number") return value;
  if (value && typeof value === "object") {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "string" || typeof id === "number") return { id };
  }
  return "";
}

function contentUrl(collectionSlug: string, slug?: string): string {
  if (!slug) return siteUrl;

  const paths: Record<string, string> = {
    frequency: `/frequency/${slug}`,
    pages: slug === "home" ? "/" : `/${slug}`,
    posts: `/blog/${slug}`,
    research: "/research",
    uses: `/uses/${slug}`,
  };

  return `${siteUrl}${paths[collectionSlug] ?? `/${slug}`}`;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Frequency, Uses, Research, Pages],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ["posts", "frequency", "uses", "research", "pages"],
      uploadsCollection: "media",
      generateTitle: ({ doc }) =>
        textField(doc, "title")
          ? `${textField(doc, "title")} | Binaural Studio`
          : "Binaural Studio",
      generateDescription: ({ doc }) =>
        textField(doc, "excerpt") ||
        textField(doc, "description") ||
        textField(doc, "summary") ||
        "Research-aware binaural beat and isochronic tone guides from Binaural Studio.",
      generateImage: ({ doc }) => uploadReference(doc, "featuredImage"),
      generateURL: ({ collectionSlug, doc }) =>
        contentUrl(collectionSlug || "", textField(doc, "slug")),
    }),
  ],
});
