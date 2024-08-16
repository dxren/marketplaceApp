export const DEFAULT_PAGE_LIMIT = 10;

export const PRISMA_SELECT_USER_SUMMARY = {
    id: true,
    displayName: true,
    createdAt: true,
};

export const PRISMA_SELECT_ASK = {
    id: true,
    title: true,
    description: true,
    createdAt: true,
    user: {
        select: PRISMA_SELECT_USER_SUMMARY
    }
};

export const PRISMA_SELECT_OFFER = {
    id: true,
    title: true,
    description: true,
    createdAt: true,
    user: {
        select: PRISMA_SELECT_USER_SUMMARY
    }
};

export const PRISMA_SELECT_SOCIAL = {
    id: true,
    name: true,
    value: true,
    user: {
        select: PRISMA_SELECT_USER_SUMMARY
    }
};

export const PRISMA_SELECT_USER = {
    id: true,
    displayName: true,
    biography: true,
    createdAt: true,
    socials: { select: PRISMA_SELECT_SOCIAL },
    asks: { select: PRISMA_SELECT_ASK },
    offers: { select: PRISMA_SELECT_OFFER }
};
