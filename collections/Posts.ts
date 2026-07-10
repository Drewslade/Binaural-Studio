import type { CollectionConfig } from "payload";

import { contentAccess } from "./access";

export const Posts: CollectionConfig = {
  slug: "posts",
  access: contentAccess,
  admin: {
    defaultColumns: ["title", "status", "publishedDate"],
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
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: ["draft", "published"],
      required: true,
    },
    {
      name: "publishedDate",
      type: "date",
    },
  ],
};
