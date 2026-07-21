# Binaural Studio Decision Log

This file records important decisions that should not be repeatedly reconsidered without new information.

Use this format:

## YYYY-MM-DD: Decision title

**Status:** Proposed, Accepted, Rejected, or Superseded

**Decision:**  
What was decided.

**Reasoning:**  
Why the decision was made.

**Consequences:**  
What this changes or requires.

**Revisit when:**  
Conditions that would justify reconsidering the decision.

---

## 2026-07-14: Use repository Markdown files as the project source of truth

**Status:** Accepted

**Decision:**  
Maintain a small set of Markdown files that describe the project vision, context, stack, content strategy, workflow, AI-agent rules, tone, and major decisions.

**Reasoning:**  
Chat history contains useful context but is difficult for coding tools and collaborators to inspect reliably. Repository documentation creates a durable, versioned, reviewable source of truth.

**Consequences:**  
Material project changes should update the relevant Markdown file. AI tools should read these files before making significant changes.

**Revisit when:**  
The documentation becomes too large, fragmented, or difficult to maintain.

---

## 2026-07-14: Use GitHub, Vercel, Supabase, and Payload as the core platform stack

**Status:** Accepted

**Decision:**  
Use GitHub for source control, Vercel for hosting and deployments, Supabase Postgres for data, and Payload for structured editorial content.

**Reasoning:**  
This stack supports AI-assisted development, version control, preview deployments, structured content management, and future product features.

**Consequences:**  
System ownership must remain clear. Editorial content should not be duplicated into another system without a documented reason.

**Revisit when:**  
The stack creates significant operational, cost, performance, or collaboration problems.

---

## 2026-07-14: Use Vercel preview deployments as the default staging environment

**Status:** Accepted

**Decision:**  
Use branch-based Vercel preview deployments for staging and review before production.

**Reasoning:**  
Preview deployments are faster and easier than maintaining a separate static staging server while still allowing review of production-like builds.

**Consequences:**  
Preview environments must be configured carefully so they do not unintentionally modify production content or data.

**Revisit when:**  
The project requires persistent staging data, complex editorial review, or multi-step release management.

---

## 2026-07-14: Position Binaural Studio as evidence-aware, not clinical

**Status:** Accepted

**Decision:**  
Binaural Studio will explain research and practical use without presenting itself as a medical provider or clinical authority.

**Reasoning:**  
The founder is a marketer and investigator-practitioner, not a physician or neuroscientist. Trust is best built through transparency, sourcing, careful interpretation, and practical usefulness.

**Consequences:**  
Content must avoid unsupported health claims and clearly state limitations.

**Revisit when:**  
The project adds qualified medical or scientific reviewers.

---

## 2026-07-14: Prioritize foundational educational content before broad expansion

**Status:** Accepted

**Decision:**  
Begin with a strong foundation around “What Are Binaural Beats?” and closely related supporting topics before publishing broadly.

**Reasoning:**  
A coherent topic cluster is more useful for users, search engines, internal linking, and future authority than a scattered set of articles.

**Consequences:**  
Initial publishing should follow the foundational cluster defined in `CONTENT_AND_MARKETING.md`.

**Revisit when:**  
The foundational cluster is substantially complete or performance data identifies a stronger opportunity.

---

## 2026-07-21: Pilot the editorial workflow on Posts

**Status:** Proposed

**Decision:**  
Pilot Payload drafts, version history, owner approval, scheduled publishing, and published-only public access on the Posts collection before expanding the workflow to other collections.

**Reasoning:**  
A single-collection pilot limits database and editorial risk while establishing the workflow needed for the first foundational articles. No expert-review stage will be represented until a qualified reviewer is actually available.

**Consequences:**  
The change requires a reviewed Payload migration, a protected Vercel job runner, a `CRON_SECRET`, and preview verification before merge. The first batch is limited to two articles.

**Revisit when:**  
The first two posts have moved through the workflow and scheduled publishing has been verified in production.
