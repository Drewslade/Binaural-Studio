# Binaural Studio

The code behind [binaural-studio.com](https://binaural-studio.com): a free binaural beat / isochronic tone generator with research-aware listening guides.

**Stack:** Next.js App Router, Payload CMS, Supabase Postgres, Tailwind CSS, Vercel

## Quick Start

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`. Payload's admin runs at `http://localhost:3000/admin` after `DATABASE_URL` and `PAYLOAD_SECRET` are set.

| Script | What it does |
|---|---|
| `npm run dev` | Next dev server with Payload mounted at `/admin` |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run payload` | Run the Payload CLI |
| `npm run payload:generate` | Generate Payload TypeScript types |
| `npm run payload:migrate:create` | Create a Payload database migration |
| `npm run payload:migrate` | Run Payload database migrations |

## Project Layout

```text
app/(payload)/      Payload admin, REST API, GraphQL API
collections/        Payload CMS collections
payload.config.ts   Payload database, admin, editor, SEO config
lib/audio-engine/   Framework-agnostic Web Audio engine
lib/content.ts      Legacy Markdown reader used until content is imported
content/            Existing Markdown content to migrate into Payload
app/(dark)/         Ink-dark pages: home, /studio
app/(light)/        Paper-light reading pages
app/api/contact/    Contact form endpoint
components/         Header, Footer, studio UI, cards
legacy/index.html   Original single-file generator
```

## Project Documentation

Repository documentation is the durable source of truth for project direction, editorial standards, and development workflows.

Recommended reading order:

1. [`docs/VISION.md`](docs/VISION.md)
2. [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md)
3. [`docs/TECH_STACK.md`](docs/TECH_STACK.md)
4. [`docs/CONTENT_AND_MARKETING.md`](docs/CONTENT_AND_MARKETING.md)
5. [`docs/TONE_OF_VOICE.md`](docs/TONE_OF_VOICE.md)
6. [`docs/DEVELOPMENT_WORKFLOW.md`](docs/DEVELOPMENT_WORKFLOW.md)
7. [`docs/DECISIONS.md`](docs/DECISIONS.md)
8. [`AGENTS.md`](AGENTS.md)

Update the relevant documentation when a material project, architectural, editorial, or workflow decision changes. Do not treat older chat context as authoritative when it conflicts with repository documentation.

## Payload Setup

Create a Supabase project, then copy the Transaction Pooler connection string on port `6543`.

Set these locally in `.env.local` and in Vercel:

```bash
DATABASE_URL=
PAYLOAD_SECRET=
```

Use a strong random `PAYLOAD_SECRET`. For production, also make sure Vercel has the same values before deploying.

Once the env vars are set:

1. Run `npm run dev`
2. Visit `http://localhost:3000/admin`
3. Create the first admin user
4. Create and run migrations when the schema is ready:

```bash
npm run payload:migrate:create
npm run payload:migrate
```

## Deploying To Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Point the `binaural-studio.com` domain at the Vercel project.
3. Add `DATABASE_URL` and `PAYLOAD_SECRET` in Vercel project settings.
4. Add contact-form env vars if enabling Resend.
5. Deploy with `npm run build`.

## Contact Form

Without configuration the form returns a friendly "not wired up yet" error. To enable it:

1. Create a [Resend](https://resend.com) account and API key.
2. In Vercel, set `RESEND_API_KEY`.
3. Optional: set `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`.

## Content Model

- **Frequency** (`frequency`) - the five EEG bands; fixed set, editable copy
- **Uses** (`uses`) - use-case guides tagged with bands and linked to research entries
- **Research** (`research`) - curated studies with source URL, summary, tags, evidence strength, and featured flag
- **Posts** (`posts`) - standard blog posts
- **Pages** (`pages`) - editable static pages
- **Media** (`media`) - image uploads

The existing Markdown files remain in `content/` until they are imported into Payload.

> Warning: The seeded research entries are placeholders. The studies are real and well-known, but the citations and links should be verified against the actual papers before launch.

## Deferred To V2

- Preset auto-load from `/uses/[slug]` into `/studio` via URL params
- Automated research discovery/sourcing
