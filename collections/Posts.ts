import type { CollectionConfig } from "payload";

import { authenticated, publishedOrAuthenticated } from "./access";

export const Posts: CollectionConfig = {
  slug: "posts",
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ["title", "editorialStage", "_status", "publishedDate"],
    description:
      "Write and save a draft, move it to Owner review, then mark it Approved before publishing.",
    useAsTitle: "title",
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data?._status !== "published") return data;

        const editorialStage =
          data.editorialStage ?? originalDoc?.editorialStage;

        if (editorialStage !== "approved") {
          throw new Error(
            "Move this post to Approved before it can become published.",
          );
        }

        if (!data.publishedDate && !originalDoc?.publishedDate) {
          data.publishedDate = new Date().toISOString();
        }

        return data;
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
      schedulePublish: true,
      validate: false,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "excerpt",
      type: "textarea",
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "editorialStage",
      type: "select",
      defaultValue: "writing",
      options: [
        {
          label: "Writing",
          value: "writing",
        },
        {
          label: "Owner review",
          value: "owner-review",
        },
        {
          label: "Approved",
          value: "approved",
        },
      ],
      required: true,
      admin: {
        description:
          "This is the human review gate. Only Approved posts can become published.",
        position: "sidebar",
      },
    },
    {
      name: "ownerReviewNotes",
      type: "textarea",
      admin: {
        description:
          "Record required changes, final checks, or the reason the post was approved.",
        position: "sidebar",
      },
    },
    {
      name: "ownerReviewedAt",
      type: "date",
      admin: {
        date: {
          displayFormat: "MMM d, yyyy h:mm a",
        },
        position: "sidebar",
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      admin: {
        description: "Use Drew Slade for the initial editorial batch.",
        position: "sidebar",
      },
    },
    {
      name: "publishedDate",
      type: "date",
      admin: {
        description:
          "Set automatically on first publication when no date is supplied.",
        position: "sidebar",
      },
    },
    {
      name: "lastReviewedDate",
      type: "date",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sources",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: ["draft", "published"],
      admin: {
        hidden: true,
      },
    },
  ],
};
