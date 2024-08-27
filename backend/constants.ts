import { Prisma } from "@prisma/client";

export const DEFAULT_PAGE_LIMIT = 10;

export const PRISMA_SELECT_POST = {
    id: true,
    title: true,
    description: true,
    createdAt: true,
    userId: true,
};

export const PRISMA_SELECT_SOCIAL = {
    id: true,
    name: true,
    value: true,
    userId: true,
};

export const PRISMA_SELECT_USER = {
    id: true,
    avatarUrl: true,
    displayName: true,
    biography: true,
    createdAt: true,
};

export const PRISMA_WHERE_TITLE_OR_DESCRIPTION_CONTAINS_SUBSTRING = (searchString?: string) => ({
    OR: [
        {
            title: {
                contains: searchString,
                mode: 'insensitive' as Prisma.QueryMode
            }
        },
        {
            description: {
                contains: searchString,
                mode: 'insensitive' as Prisma.QueryMode
            }
        }
    ]
});