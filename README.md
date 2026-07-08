# Binaural Studio

The code behind [binaural-studio.com](https://binaural-studio.com) — a free binaural beat / isochronic tone generator with research-aware listening guides.

**Stack:** Next.js (App Router) · TinaCMS (git-backed content) · Tailwind CSS · Vercel

## Quick start

```bash
npm install
npm run dev        # site at http://localhost:3000, CMS at http://localhost:3000/admin
```

`npm run dev` runs TinaCMS in local mode — the `/admin` editor works immediately, no account needed. Edits are written straight to the markdown files in `content/`; commit them like any other change.

| Script | What it does |
|---|---|
| `npm run dev` | Next dev server + local Tina editor at `/admin` |
| `npm run dev:next` | Next dev server only (no CMS) |
| `npm run build` | Production build (what Vercel runs — needs no CMS credentials) |
| `npm run build:tina` | Build including the hosted Tina admin (needs Tina Cloud env vars) |

## Project layout

```
lib/audio-engine/   Framework-agnostic Web Audio engine (no React/Next imports)
lib/content.ts      Reads content/ markdown at build time
tina/config.ts      CMS collections: frequency, uses, research, blog, pages
content/            All editable content (markdown + frontmatter)
app/(dark)/         Ink-dark pages: home, /studio
app/(light)/        Paper-light reading pages: /frequency, /uses, /research, /blog, /about, /contact
app/api/contact/    Contact form endpoint (Resend)
components/         Header, Footer, studio UI, cards
legacy/index.html   The original single-file generator this was ported from
```

The audio engine is deliberately isolated: `lib/audio-engine` contains the oscillator graph (binaural + isochronic), noise generators, journey scheduler, and offline WAV renderer, and imports nothing from React or Next. The studio page is just a UI over it.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel — defaults work as-is (`npm run build`)
2. Point the `binaural-studio.com` domain at the Vercel project
3. Add env vars as you enable features (below)

### Contact form (Resend)

Without configuration the form returns a friendly "not wired up yet" error. To enable it:

1. Create a [Resend](https://resend.com) account and API key
2. In Vercel, set `RESEND_API_KEY`. Optional: `CONTACT_TO_EMAIL` (defaults to drew@digitalmiddleground.com) and `CONTACT_FROM_EMAIL` (defaults to Resend's sandbox sender; switch it to a `binaural-studio.com` address after verifying the domain in Resend)

### Editing content on the live site (Tina Cloud)

Local editing needs nothing. To edit from production `/admin`:

1. Create a free project at [app.tina.io](https://app.tina.io) connected to the GitHub repo
2. In Vercel, set `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`
3. Change the Vercel build command to `npm run build:tina`

Tina commits edits back to the repo, which re-triggers a Vercel deploy — content changes go live in a couple of minutes.

## Content model

- **Frequency** (`content/frequency/`) — the five EEG bands; fixed set, editable copy
- **Uses** (`content/uses/`) — use-case guides; tagged with bands, linked to research entries
- **Research** (`content/research/`) — curated studies: source URL, original-words summary, band/use tags, evidence strength, `featured` pins it to the top of `/research`
- **Blog** (`content/blog/`) — standard posts
- **Pages** (`content/pages/`) — the About page

> ⚠️ **The seeded research entries are placeholders.** The studies are real and well-known, but the citations/links were written from memory — verify each title, author, and URL against the actual paper before launch, per the "no unverified study content" rule.

## Deliberately deferred to v2

- Preset auto-load from `/uses/[slug]` into `/studio` via URL params
- Automated research discovery/sourcing (manual curation only in v1 — legal + reliability risk)
