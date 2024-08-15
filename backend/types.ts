import { Ask, Offer, Social, User } from "../shared/types";

export const PRISMA_SELECT_USER_SUMMARY = {
    id: true,
    displayName: true,
    createdAt: true,
}

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
}

export const PRISMA_SELECT_USER = {
    id: true,
    displayName: true,
    biography: true,
    createdAt: true,
    socials: {select: PRISMA_SELECT_SOCIAL},
    asks: {select: PRISMA_SELECT_ASK},
    offers: {select: PRISMA_SELECT_OFFER}
};

export type CreateAskParams = {
    title: string;
    description?: string;
    userId: string;
};
export type SetAsksForUserParams = Omit<CreateAskParams, 'userId'>;
export type UpdateAskParams = Partial<SetAsksForUserParams>;

export type CreateOfferParams = {
    title: string;
    description?: string;
    userId: string;
};
export type SetOffersForUserParams = Omit<CreateOfferParams, 'userId'>
export type UpdateOfferParams = Partial<SetOffersForUserParams>;

export type UpdateUserParams = Partial<Omit<User, 'id' | 'createdAt'>>;

export type SetSocialsForUserParams = {
    name: string;
    value: string;
};
export type UpdateSocialParams = {
    name?: string;
    value?: string;
};
export type CreateSocialParams = {
    name: string;
    value: string;
    userId: string;
};