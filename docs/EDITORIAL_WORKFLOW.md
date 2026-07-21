# Editorial workflow

## Scope

This is the first editorial pilot and applies only to the Payload `posts` collection. Expand it to Pages, Uses, or Research after the pilot has been reviewed in production.

Payload is the source of truth for article content. GitHub stores the workflow and technical documentation, not duplicate article drafts.

## Status model

Two fields serve different purposes:

- Payload's native `_status` controls whether a post is a draft or published.
- `editorialStage` records the human workflow: Writing, Owner review, or Approved.

A post cannot be published or scheduled unless `editorialStage` is Approved. Unauthenticated API requests can only read posts whose native `_status` is Published.

No expert-review stage is included in this pilot because no qualified expert is currently available. Do not imply expert review in article copy, metadata, or disclosures.

## Workflow

1. Create the article in Payload and save it as a draft.
2. Complete the research, writing, SEO, AEO, sourcing, and tone checks.
3. Move `editorialStage` to Owner review.
4. Drew reviews the post, records notes, and requests changes if needed.
5. Once the post passes the checklist, set `editorialStage` to Approved and record `ownerReviewedAt`.
6. Publish immediately or use Payload's schedule control.
7. Publish in small batches, then verify the live URL, metadata, structured data, sitemap, analytics, and internal links before scheduling more.

Payload keeps up to 50 versions per post and autosaves drafts. Scheduled publish jobs are processed daily by Vercel through Payload's protected jobs endpoint.

## Initial batch

Keep the first batch to two articles:

1. What Are Binaural Beats?
2. Do You Need Headphones for Binaural Beats?

The first article is the pillar. The second should support it and link back to it. Do not schedule the second article until the first is live and its page, metadata, structured data, citations, and internal links have been checked.

## Approval checklist

Before setting a post to Approved, confirm:

- The main question is answered near the beginning.
- Scientific claims match the cited evidence and its limitations.
- No medical, expert-review, personal-experience, or experiment claim is invented.
- Sources are primary and reliable where practical.
- Author, dates, disclosures, title, meta description, and image alt text are accurate.
- The article follows `docs/TONE_OF_VOICE.md`.
- The post includes useful internal links and a context-specific next step.
- The public page has been reviewed in a Vercel preview.
- No em dashes, hype, generic wellness claims, or canned AI phrasing remain.

## Deployment requirements

Before enabling the cron in production:

1. Add a random `CRON_SECRET` of at least 16 characters to the Vercel project.
2. Generate and review the Payload database migration for the Posts versions, drafts, editorial fields, and jobs tables.
3. Run the migration against a non-production database first.
4. Confirm previews do not mutate production content.
5. Deploy the reviewed migration before or with the application code.
6. Verify unauthenticated `GET /api/posts` returns only published posts.
7. Verify an authenticated owner can save a draft, move it through review, approve it, schedule it, and inspect its version history.
8. Verify an unapproved post cannot be published or scheduled.
9. Verify the Vercel cron receives HTTP 200 with the authorization header and that an unauthenticated manual request is rejected.

Do not merge this change until the migration and preview checks are complete.
