# Binaural Studio Editorial Workflow

## Purpose

GitHub Markdown is the source of truth for public editorial content. This workflow keeps drafts reviewable, prevents unfinished articles from becoming public, and gives each published page consistent author, research, SEO, social, citation, and structured-data fields.

## Content locations

- `content/drafts/`: unpublished working drafts. The website does not read this collection.
- `content/templates/article.md`: the canonical article template and frontmatter schema.
- `content/blog/`: published articles. Only entries with `status: "published"` are listed, rendered, or added to the sitemap.
- `content/research/`: study summaries and evidence notes.

Do not maintain the same article in multiple content systems.

## Status lifecycle

1. `draft`: research, structure, or copy is incomplete.
2. `in-review`: ready for claim, source, tone, metadata, and visual review.
3. `approved`: owner approved, but not yet public.
4. `published`: eligible for public rendering and the sitemap after the file is moved to `content/blog/`.
5. `archived`: retained for history but not public.

The folder and status must both be publish-safe. A draft stays in `content/drafts/`. Approval does not publish it. Publication requires moving the file to the public collection, setting `status: "published"`, adding the publication date, confirming indexable robots settings, and merging the reviewed pull request.

## Frontmatter rules

Use `content/templates/article.md` for new articles. The schema supports:

- identity: title, slug, content type, category, and tags;
- workflow: status and review stage;
- author: name, role, URL, bio, and accurately stated areas of expertise;
- dates: created, published, updated, editorial review, and research check;
- SEO: title, description, canonical URL, and robots directives;
- social: Open Graph and X/Twitter titles, descriptions, and images;
- evidence: structured citation records tied to the claims they support;
- structured data: Schema.org article type, topics, mentioned entities, and citations;
- discovery: related content;
- transparency: AI assistance and external expert review.

Use ISO dates in `YYYY-MM-DD` format. Leave dates blank when the event has not happened. Never enter an expert reviewer, publication date, or review date in anticipation of future work.

## Research and citation review

For every factual, scientific, historical, medical, or safety claim:

1. Open the original source when reasonably available.
2. Confirm authors, title, publication, year, DOI or stable URL, study population, design, outcome, and important limitations.
3. Describe what the source measured, not what a headline implies.
4. Place a readable citation near the supported claim.
5. Add the source to the frontmatter `citations` list and explain the claim in `supports`.
6. Prefer systematic reviews, controlled studies, and authoritative institutional guidance.
7. Record the research-check date only after this pass is complete.

Do not treat a measured EEG response as proof of a practical benefit. Do not treat a statistically significant group result as a guarantee for an individual listener.

## Pull request review

Each content pull request should remain a draft until Drew reviews it. Check:

- the main question is answered early;
- claims match the cited evidence;
- limitations and safety boundaries are clear;
- the tone follows `docs/TONE_OF_VOICE.md`;
- author and disclosure fields are accurate;
- SEO title, description, canonical URL, and robots values are intentional;
- social metadata and images are ready;
- article structured data matches the visible page;
- internal links resolve and related content is useful;
- the article remains outside the public collection unless publication is explicitly approved;
- build, type, sitemap, and preview checks pass.

## Publication checklist

After owner approval:

1. Move the approved file from `content/drafts/` to `content/blog/`.
2. Set `status: "published"`.
3. Set `dates.published` to the real publication date and update `dates.updated` if needed.
4. Set `seo.robots.index: true` and `follow: true`.
5. Confirm the canonical URL matches the final route.
6. Run the build and review the Vercel preview.
7. Validate visible author information, dates, metadata, JSON-LD, citations, related links, and sitemap inclusion.
8. Merge only after approval.
9. Verify the production page and sitemap after deployment.

## Current safeguard

The “What Are Binaural Beats?” article remains a draft. It must not be moved, merged as published content, or made indexable until Drew reviews and approves it.

