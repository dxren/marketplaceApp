import { Prisma } from "@prisma/client";

export const DEFAULT_PAGE_LIMIT = 10;

export const PRISMA_SELECT_USER_SUMMARY = {
  id: true,
  avatarUrl: true,
  displayName: true,
  createdAt: true,
};

export const PRISMA_SELECT_ASK = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
  user: {
    select: PRISMA_SELECT_USER_SUMMARY,
  },
};

export const PRISMA_SELECT_OFFER = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
  user: {
    select: PRISMA_SELECT_USER_SUMMARY,
  },
};

export const PRISMA_SELECT_SOCIAL = {
  id: true,
  name: true,
  value: true,
  user: {
    select: PRISMA_SELECT_USER_SUMMARY,
  },
};

export const PRISMA_SELECT_USER = {
  id: true,
  avatarUrl: true,
  displayName: true,
  biography: true,
  createdAt: true,
  socials: { select: PRISMA_SELECT_SOCIAL },
  asks: { select: PRISMA_SELECT_ASK },
  offers: { select: PRISMA_SELECT_OFFER },
};

export const PRISMA_WHERE_TITLE_OR_DESCRIPTION_CONTAINS_SUBSTRING = (
  searchString?: string
) => ({
  OR: [
    {
      title: {
        contains: searchString,
        mode: "insensitive" as Prisma.QueryMode,
      },
    },
    {
      description: {
        contains: searchString,
        mode: "insensitive" as Prisma.QueryMode,
      },
    },
  ],
});

export const PRISMA_SELECT_COMMENT = {
  id: true,
  content: true,
  createdAt: true,
  user: {
    select: PRISMA_SELECT_USER_SUMMARY,
  },
  updatedAt: true,
  askId: true,
  offerId: true,
  commentId: true,
};
