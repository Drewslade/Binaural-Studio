import type { CollectionConfig } from "payload";

import { contentAccess } from "./access";

export const Uses: CollectionConfig = {
  slug: "uses",
  access: contentAccess,
  admin: {
    defaultColumns: ["title", "description"],
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
      name: "description",
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
      name: "relatedResearch",
      type: "relationship",
      hasMany: true,
      relationTo: "research",
    },
    {
      name: "body",
      type: "richText",
      required: true,
    },
  ],
};
