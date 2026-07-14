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

### Payload CMS

Payload is the primary editorial interface for structured site content.

Expected responsibilities include:

- Articles and pages.
- Authors.
- Categories and tags.
- Research entries and citations.
- Update history.
- SEO fields.
- Editorial status.
- Media metadata.

Avoid duplicating content ownership across Payload and another system without a documented reason.

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

- Payload owns structured editorial content.
- Supabase Postgres stores Payload data and future application data.
- GitHub owns code and technical documentation.
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
