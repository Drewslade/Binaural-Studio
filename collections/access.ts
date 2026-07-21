import type { Access } from "payload";

export const anyone: Access = () => true;

export const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true;

  return {
    _status: {
      equals: "published",
    },
  };
};

export const contentAccess = {
  read: anyone,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
};
