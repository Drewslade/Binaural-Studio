# Binaural Studio Technical Stack

## Core platforms

### GitHub

GitHub is the primary source code repository, editorial content store, and version history. Use it for code, Markdown content, documentation, pull requests, issues, change history, and deployment integration.

### Vercel

Vercel is the hosting and deployment platform. Use it for production hosting, preview deployments, environment variables, deployment logs, and rollbacks.

Material changes should be reviewed in a preview deployment before production when practical.

### Supabase

Supabase is available for future application data, authentication, storage, server-side functions, user preferences, experiment data, or a custom editorial tool.

The public website and Markdown editorial workflow do not currently depend on Supabase. Future use should keep application data separate from archived Payload tables and should be documented before implementation.

### Markdown editorial content

Markdown files in GitHub are the source of truth for public editorial content, including articles, pages, frequency guides, use-case guides, and research summaries.

This approach provides:

- Version history and review through Git.
- Direct compatibility with AI-assisted development tools.
- Portable content that is not coupled to a database.
- Vercel previews for editorial review.
- Structured frontmatter for authors, dates, categories, images, and SEO metadata.

The project currently has no CMS installed. A future visual editor may be built after the workflow reveals a specific need. It should write to the same Markdown source or use a deliberate, documented migration.

## Application stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Repository Markdown and structured frontmatter.
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

Used for coding, debugging, content work, component development, and tests.

### Preview or staging

Vercel preview deployments are the default staging layer for branch and pull-request review.

Review page rendering, responsive behavior, metadata, structured data, redirects, forms, analytics, accessibility, and performance.

### Production

Production changes should be traceable to a Git commit and deployment record. Reviewed changes should normally reach production through the main branch.

## Environment variables

Environment variables should be stored in Vercel and local environment files, named consistently, documented without exposing secrets, and separated by environment where needed.

Never commit secrets.

## Data ownership

- GitHub owns code, technical documentation, and public Markdown editorial content.
- Vercel owns deployment configuration and runtime settings.
- Supabase owns future application data only when a feature is deliberately implemented there.
- Analytics platforms own traffic and behavior data.
- Search Console owns organic search performance data.

## Technical priorities

1. Keep the Markdown content schema consistent.
2. Maintain build, lint, and type checks.
3. Document environment variables.
4. Document backups and rollback procedures.
5. Validate structured data and metadata.
6. Monitor builds, forms, and important public pages.
7. Record workflow friction before designing a custom editorial interface.
8. Separate future application data from archived Payload tables before reuse.
