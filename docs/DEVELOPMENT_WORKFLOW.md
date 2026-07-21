# Binaural Studio Development Workflow

## Objective

Create a repeatable process for shipping changes quickly without losing reliability, maintainability, or human control.

## Standard workflow

### 1. Define the change

Document the problem, desired outcome, affected pages or systems, acceptance criteria, known constraints, risks, and whether content, code, data, or infrastructure is involved.

### 2. Review source files

Before implementation, review the relevant files in `docs/`, `AGENTS.md`, repository documentation, existing code, and content models.

### 3. Create a branch

Use a branch for material changes. Recommended prefixes:

- `feature/`
- `fix/`
- `content/`
- `seo/`
- `chore/`

### 4. Implement locally

Keep changes scoped, reuse existing components, avoid unnecessary dependencies, preserve accessibility and performance, validate mobile behavior, and update types, tests, and documentation as needed.

### 5. Test

At minimum, test build completion, type checks, core page rendering, mobile and desktop layouts, navigation, forms, Markdown rendering, metadata, structured data, redirects, and error states when relevant.

### 6. Review in preview deployment

Use a Vercel preview deployment as the default staging environment.

Review visual quality, content accuracy, responsive behavior, SEO metadata, analytics, accessibility, performance, browser errors, and production-like environment variables.

### 7. Merge and deploy

Merge after the change satisfies the acceptance criteria. After deployment, verify the production page, analytics, forms, metadata, and major user paths.

### 8. Update documentation

Update source files when changes affect architecture, content models, workflows, environment variables, business direction, editorial policy, dependencies, deployment procedures, or long-term decisions.

## Editorial publishing

Public articles and pages are authored as Markdown and reviewed through branches, pull requests, and Vercel previews.

- Keep unfinished work outside public content collections.
- Use small content batches.
- Use consistent frontmatter for status, title, slug, content type, summary, author, dates, category, image, and SEO fields.
- Move an article into its public collection only when the template, metadata, citations, images, and internal links are ready.
- Verify the first item in a batch in production before publishing the next.
- Do not maintain the same published article in more than one system.
- Record workflow friction before building a custom editorial interface.

## Staging approach

The primary staging approach is Vercel preview deployments:

- Local environment for development.
- Preview deployment for review and QA.
- Production deployment from `main`.

The current public website does not need a database. If a future feature uses Supabase or another data service, preview environments must not unintentionally edit production data.

## Database and custom-tool changes

Future schema changes should include a migration, rollback plan, environment testing, seed or fixture updates where appropriate, documentation, and a data-loss review.

Never assume a local schema change is safe in production. Do not delete archived Payload tables until the Payload-free production deployment is verified and their contents are confirmed disposable.

## AI-assisted development rules

AI coding tools may draft code, refactor, write tests, review code, inspect logs, propose architecture, and update documentation.

AI coding tools should not commit secrets, make destructive database changes without review, replace stable systems without a clear reason, create overlapping sources of truth, silently change business logic, deploy unreviewed production changes, invent API behavior, or assume chat history overrides repository documentation.

## Definition of done

A task is complete when the expected behavior works, the change has been reviewed, relevant checks pass, the preview deployment is verified, production is verified when deployed, documentation is updated, and known limitations are recorded.
