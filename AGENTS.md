# Agent Notes

## Public routes and sitemap

- When adding, renaming, or removing any public page route, update `app/sitemap.ts` in the same change.
- Public routes include static App Router pages, dynamic content pages such as `/frequency/[slug]`, `/uses/[slug]`, and `/blog/[slug]`, and any new content collection that should be indexed.
- Do not add admin, API, preview, or internal-only routes to the sitemap.
- After changing routes or the sitemap, run `npm run build` and confirm `/sitemap.xml` is generated successfully.
