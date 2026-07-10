import { defineConfig } from "tinacms";

// Runs fully locally with `npm run dev` (no account needed).
// For editing on the live site, create a project at https://app.tina.io
// and set NEXT_PUBLIC_TINA_CLIENT_ID + TINA_TOKEN in Vercel, then switch
// the Vercel build command to `npm run build:tina`.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const BAND_OPTIONS = ["delta", "theta", "alpha", "beta", "gamma"];
const USE_OPTIONS = ["focus", "meditation", "sleep", "relaxation", "walking"];

const slugify = (values: Record<string, unknown> | undefined) =>
  String(values?.title ?? "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "frequency",
        label: "Frequency Bands",
        path: "content/frequency",
        format: "md",
        ui: {
          // The five EEG bands are fixed; edit them, don't add more.
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Band name",
            isTitle: true,
            required: true,
          },
          { type: "number", name: "hzLow", label: "Hz range — low", required: true },
          { type: "number", name: "hzHigh", label: "Hz range — high", required: true },
          {
            type: "string",
            name: "description",
            label: "Short description",
            required: true,
            ui: { component: "textarea" },
          },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },
      {
        name: "uses",
        label: "Uses",
        path: "content/uses",
        format: "md",
        ui: { filename: { slugify } },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Short description",
            required: true,
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "bands",
            label: "Related frequency bands",
            list: true,
            options: BAND_OPTIONS,
          },
          {
            type: "object",
            name: "relatedResearch",
            label: "Related research",
            list: true,
            ui: {
              itemProps: (item: Record<string, unknown>) => ({
                label: String(item?.entry ?? "Pick a study"),
              }),
            },
            fields: [
              {
                type: "reference",
                name: "entry",
                label: "Study",
                collections: ["research"],
              },
            ],
          },
          { type: "rich-text", name: "body", label: "Guide", isBody: true },
        ],
      },
      {
        name: "research",
        label: "Research",
        path: "content/research",
        format: "md",
        ui: { filename: { slugify } },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Study title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "sourceUrl",
            label: "Source URL",
            required: true,
          },
          {
            type: "string",
            name: "summary",
            label: "Summary (your own words — never scraped text)",
            required: true,
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "bands",
            label: "Frequency bands",
            list: true,
            options: BAND_OPTIONS,
          },
          {
            type: "string",
            name: "useCases",
            label: "Use cases",
            list: true,
            options: USE_OPTIONS,
          },
          {
            type: "string",
            name: "evidenceStrength",
            label: "Evidence strength",
            options: ["preliminary", "mixed", "moderate", "strong"],
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured (pinned at the top of /research)",
          },
          { type: "datetime", name: "date", label: "Publication date" },
        ],
      },
      {
        name: "blog",
        label: "Blog",
        path: "content/blog",
        format: "md",
        ui: { filename: { slugify } },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          { type: "datetime", name: "date", label: "Date", required: true },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            ui: { component: "textarea" },
          },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },
      {
        name: "pages",
        label: "Pages",
        path: "content/pages",
        format: "md",
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },
    ],
  },
});
