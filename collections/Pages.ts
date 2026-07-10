import type { CollectionConfig } from "payload";

import { contentAccess } from "./access";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: contentAccess,
  admin: {
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
      name: "body",
      type: "richText",
      required: true,
    },
  ],
};
