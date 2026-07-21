# AI Agent Instructions

## Required project context

Before making material changes, read:

1. `README.md`
2. `docs/VISION.md`
3. `docs/PROJECT_CONTEXT.md`
4. `docs/TECH_STACK.md`
5. `docs/CONTENT_AND_MARKETING.md`
6. `docs/TONE_OF_VOICE.md` for content or public-facing copy
7. `docs/DEVELOPMENT_WORKFLOW.md`
8. `docs/DECISIONS.md`

Also inspect the relevant code, content file, route, component, or data model before proposing changes.

Repository documentation is the source of truth when it conflicts with older chat context.

## General behavior

- Prefer small, reviewable changes.
- Preserve maintainability, accessibility, and responsive behavior.
- Reuse existing components and project patterns.
- Avoid unnecessary dependencies.
- Explain meaningful architectural tradeoffs.
- Do not claim a change was tested unless it was actually tested.
- Do not claim a deployment succeeded unless it was verified.
- Update documentation when architecture, behavior, or workflow changes.

## Architecture rules

- GitHub owns code, technical documentation, and public Markdown editorial content.
- Vercel owns hosting and deployment configuration.
- The website currently has no CMS dependency.
- Supabase is reserved for future application data, authentication, storage, or a deliberately approved custom tool.
- A future visual editor must write to the repository Markdown files or follow a documented source-of-truth migration.
- Avoid creating multiple authoritative homes for the same data.
- Use environment variables for secrets and environment-specific configuration.
- Document new services, dependencies, and data ownership decisions.

## Content and research rules

- Follow `docs/TONE_OF_VOICE.md` for all public-facing writing.
- Do not invent research findings, citations, expert reviews, personal experiences, or test results.
- Distinguish evidence, interpretation, personal observation, spiritual belief, and marketing claims.
- Avoid unsupported medical claims.
- Use plain language and state meaningful limitations.
- Add author, publish date, update date, and source fields where appropriate.
- Keep unfinished articles outside public content collections.
- Use structured frontmatter consistently and update templates when adding an editorial field.
- Optimize for clarity and usefulness before keyword density.

## Coding rules

- Follow the existing Next.js, TypeScript, Markdown, and Tailwind patterns.
- Keep the audio engine framework-independent unless a documented decision changes that architecture.
- Validate external inputs and add appropriate error handling.
- Never expose secrets or make destructive database changes without review.
- Add or update tests when behavior changes.
- Run relevant build, lint, and type checks.

## Public routes and sitemap

- When adding, renaming, or removing any public page route, update `app/sitemap.ts` in the same change.
- Public routes include static App Router pages, dynamic content pages such as `/frequency/[slug]`, `/uses/[slug]`, and `/blog/[slug]`, and any new content collection that should be indexed.
- Do not add admin, API, preview, or internal-only routes to the sitemap.
- After changing routes or the sitemap, run `npm run build` and confirm `/sitemap.xml` is generated successfully.

## SEO and AEO review

For public pages, review:

- Title and meta description.
- Canonical URL.
- Heading structure.
- Internal links.
- Structured data.
- Crawlability and indexability.
- Image alt text.
- Direct-answer clarity.
- Author and review signals.
- Source citations.
- Last updated date.

## Material change workflow

1. Summarize the proposed change.
2. Identify affected files and systems.
3. State material assumptions.
4. Implement the scoped change.
5. Run available checks.
6. Review the result in a Vercel preview when appropriate.
7. Update documentation.
8. Summarize what changed, what was tested, and what remains unresolved.

## Decision discipline

Before introducing a new framework, database, CMS, service, or major dependency:

- Explain why the current stack is insufficient.
- Compare the alternative with the current approach.
- Consider maintenance, collaboration, migration, and rollback costs.
- Record accepted material decisions in `docs/DECISIONS.md`.
