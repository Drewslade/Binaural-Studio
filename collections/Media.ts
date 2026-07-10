import type { CollectionConfig } from "payload";

import { contentAccess } from "./access";

export const Media: CollectionConfig = {
  slug: "media",
  access: contentAccess,
  admin: {
    useAsTitle: "alt",
  },
  upload: {
    staticDir: "public/uploads",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};
