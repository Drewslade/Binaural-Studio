import type { CollectionConfig } from "payload";

import { contentAccess } from "./access";

export const Research: CollectionConfig = {
  slug: "research",
  access: contentAccess,
  admin: {
    defaultColumns: ["title", "evidenceStrength", "featured", "date"],
    useAsTitle: "title",
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
      name: "sourceUrl",
      type: "text",
      required: true,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
    },
    {
      name: "bands",
      type: "relationship",
      hasMany: true,
      relationTo: "frequency",
    },
    {
      name: "useCases",
      type: "relationship",
      hasMany: true,
      relationTo: "uses",
    },
    {
      name: "evidenceStrength",
      type: "select",
      options: ["preliminary", "mixed", "moderate", "strong"],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "date",
      type: "date",
    },
    {
      name: "body",
      type: "richText",
    },
  ],
};
