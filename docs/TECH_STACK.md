# Binaural Studio Technical Stack

## Core platforms

### GitHub

GitHub is the primary source code repository and version history. Use it for code, documentation, pull requests, issues, change history, and deployment integration.

### Vercel

Vercel is the hosting and deployment platform. Use it for production hosting, preview deployments, environment variables, deployment logs, and rollbacks.

Material changes should be reviewed in a preview deployment before production when practical.

### Supabase

Supabase provides the PostgreSQL database used by Payload and may support future application data, authentication, storage, server-side functions, user preferences, and experiment data.

The exact schema should be documented separately as it stabilizes.

### Markdown editorial content

Markdown files in GitHub are the primary source of truth for public editorial content, including articles, pages, frequency guides, use-case guides, and research summaries.

This approach provides:

- Version history and review through Git.
- Direct compatibility with Codex, Claude, and other development tools.
- Portable content that is not coupled to a database.
- Preview deployments for editorial review.
- Structured frontmatter for authors, dates, categories, images, and SEO metadata.

A future visual editor may be added for browser-based editing. It must read and write the same repository Markdown files so the project keeps one authoritative content source.

### Payload CMS

Payload is installed and available for structured content or application data when a database-backed admin interface provides a clear benefit. It is not the default owner of blog articles or public editorial pages.

Before moving any content type into Payload, document the reason, migration plan, editing workflow, backup approach, and source-of-truth change. Avoid representing the same published content in both Payload and Markdown.

## Application stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Payload CMS.
- Supabase Postgres.
- Vercel.
- Resend for the contact form when configured.
- Web Audio APIs through the framework-independent audio engine.

## AI development tools

### Codex

Codex is used for implementation, debugging, code review, repository changes, and technical documentation.

### Claude

Claude is used for coding, planning, architecture, review, and large-context synthesis.

Both tools should read repository documentation before material work and should not rely only on previous chat context.

## Environments

### Local development

Used for coding, debugging, schema changes, content model work, component development, and tests.

### Preview or staging

Vercel preview deployments are the default staging layer for branch and pull-request review.

Review page rendering, responsive behavior, CMS integration, metadata, structured data, redirects, forms, analytics, accessibility, and performance.

### Production

Production changes should be traceable to a Git commit and deployment record. Reviewed changes should normally reach production through the main branch.

## Environment variables

Environment variables should be stored in Vercel and local environment files, named consistently, documented without exposing secrets, and separated by environment where needed.

Never commit secrets.

## Data ownership

- GitHub owns code, technical documentation, and public Markdown editorial content.
- Supabase Postgres stores future application data and any specifically approved Payload-managed data.
- Payload owns only the collections explicitly assigned to it through a documented decision.
- Vercel owns deployment configuration and runtime settings.
- Analytics platforms own traffic and behavior data.
- Search Console owns organic search performance data.

## Technical priorities

1. Document the current architecture.
2. Confirm how future application data will be separated from editorial data.
3. Define staging and migration procedures.
4. Maintain build, lint, and type checks.
5. Document environment variables.
6. Document backups and rollback procedures.
7. Standardize content models.
8. Validate structured data and metadata.
9. Monitor builds, forms, and important public pages.
