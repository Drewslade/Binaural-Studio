import type { MetadataRoute } from "next";
import { getBlogPosts, getFrequencyBands, getUses } from "@/lib/content";

const BASE = "https://binaural-studio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/studio",
    "/frequency",
    "/uses",
    "/research",
    "/blog",
    "/about",
    "/contact",
  ].map((route) => ({ url: `${BASE}${route}` }));

  const bands = getFrequencyBands().map((band) => ({
    url: `${BASE}/frequency/${band.slug}`,
  }));
  const uses = getUses().map((use) => ({ url: `${BASE}/uses/${use.slug}` }));
  const posts = getBlogPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
  }));

  return [...staticRoutes, ...bands, ...uses, ...posts];
}
