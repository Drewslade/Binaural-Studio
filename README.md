# Binaural Studio

The code behind [binaural-studio.com](https://binaural-studio.com): a free binaural beat and isochronic tone generator with research-aware listening guides.

**Stack:** Next.js App Router, repository Markdown, Tailwind CSS, and Vercel

## Quick Start

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

| Script | What it does |
|---|---|
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run the configured lint command |

## Project Layout

```text
app/(dark)/         Ink-dark pages: home and /studio
app/(light)/        Paper-light reading pages
app/api/contact/    Contact form endpoint
components/         Header, footer, studio UI, and content cards
content/            Markdown editorial content and frontmatter
lib/audio-engine/   Framework-independent Web Audio engine
lib/content.ts      Markdown content reader
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

## Editorial Content

Public editorial content is stored as Markdown in GitHub and rendered by the Next.js application.

- `content/blog/`: published blog articles
- `content/pages/`: static editorial pages
- `content/frequency/`: frequency-band guides
- `content/uses/`: use-case guides
- `content/research/`: research summaries and evidence notes
- `content/drafts/`: unpublished article drafts when the folder is in use

GitHub is the source of truth. Drafts should be reviewed through pull requests and Vercel previews before they are moved into a public collection and merged.

A future visual editor may be built if browser-based editing becomes useful. It must edit the same Markdown files or use a documented migration so the project does not create two conflicting sources of truth.

> Warning: Existing seeded research entries may contain placeholders. Verify citations and source links against the original papers before publication.

## Deploying To Vercel

1. Push the repository to GitHub and connect it to Vercel.
2. Point the `binaural-studio.com` domain at the Vercel project.
3. Add contact-form environment variables if enabling Resend.
4. Deploy with `npm run build`.

The website and public editorial content do not require a database connection.

## Contact Form

Without configuration, the form returns a friendly "not wired up yet" error. To enable it:

1. Create a [Resend](https://resend.com) account and API key.
2. In Vercel, set `RESEND_API_KEY`.
3. Optionally set `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`.

## Deferred To V2

- Preset auto-load from `/uses/[slug]` into `/studio` through URL parameters
- Automated research discovery and sourcing
- A custom editorial interface, if the Markdown and pull-request workflow proves too cumbersome
