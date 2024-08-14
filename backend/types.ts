import { Ask, Offer, Social } from "../shared/types";

export const PRISMA_SELECT_USER_SUMMARY = {
    id: true,
    displayName: true
}

export const PRISMA_SELECT_ASK = {
    id: true,
    description: true,
    createdAt: true,
    user: {
        select: PRISMA_SELECT_USER_SUMMARY
    }
};

export const PRISMA_SELECT_OFFER = {
    id: true,
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
}

export const PRISMA_SELECT_USER = {
    id: true,
    displayName: true,
    socials: {select: PRISMA_SELECT_SOCIAL},
    asks: {select: PRISMA_SELECT_ASK},
    offers: {select: PRISMA_SELECT_OFFER}
};

export type CreateAskParams = {
    description: string;
    userId: string;
};
export type SetAsksForUserParams = {
    description: string;
};
export type UpdateAskParams = {
    description: string;
}

export type CreateOfferParams = {
    description: string;
    userId: string;
};
export type SetOffersForUserParams = {
    description: string;
};
export type UpdateOfferParams = {
    description: string;
};

export type UpdateUserParams = {
    displayName?: string;
    socials?: Social[];
    asks?: Ask[];
    offers?: Offer[];
};

export type SetSocialsForUserParams = {
    name: string;
    value: string;
};