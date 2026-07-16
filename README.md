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

## Editorial Content

Public editorial content is stored as Markdown in GitHub and rendered by the Next.js application.

- `content/blog/` - published blog articles
- `content/drafts/` - articles being prepared but not exposed through the public blog routes
- `content/pages/` - static editorial pages
- `content/frequency/` - frequency-band guides
- `content/uses/` - use-case guides
- `content/research/` - research summaries and evidence notes

GitHub is the source of truth for this content. A future visual editor may be added, but it must read and write the same Markdown files rather than creating a second content database.

Payload remains installed as an optional structured-content and application-data tool. It is not the default publishing path for blog articles or public editorial pages.

> Warning: Existing seeded research entries may contain placeholders. Verify citations and source links against the actual papers before publication.

## Deferred To V2

- Preset auto-load from `/uses/[slug]` into `/studio` via URL params
- Automated research discovery/sourcing
