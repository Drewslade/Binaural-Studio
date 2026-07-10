import type { CollectionConfig } from "payload";

import { contentAccess } from "./access";

export const Frequency: CollectionConfig = {
  slug: "frequency",
  access: contentAccess,
  admin: {
    defaultColumns: ["title", "hzLow", "hzHigh"],
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
      name: "hzLow",
      type: "number",
      label: "Hz low",
      required: true,
    },
    {
      name: "hzHigh",
      type: "number",
      label: "Hz high",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "body",
      type: "richText",
      required: true,
    },
  ],
};
