import { User } from "../shared/types";

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
    avatarUrl: true,
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
export type UpdateAskParams = Partial<Omit<CreateAskParams, 'userId'>>;
export type SetAsksForUserParams = Omit<CreateAskParams, 'userId'>[];

export type CreateOfferParams = {
    title: string;
    description?: string;
    userId: string;
};
export type UpdateOfferParams = Partial<Omit<CreateOfferParams, 'userId'>>;
export type SetOffersForUserParams = Omit<CreateOfferParams, 'userId'>[];

export type CreateSocialParams = {
    name: string;
    value: string;
    userId: string;
};
export type UpdateSocialParams = Partial<Omit<CreateSocialParams, 'userId'>>;
export type SetSocialsForUserParams = Omit<CreateSocialParams, 'userId'>[];

export type UpdateUserParams = {
    displayName?: string;
    avatarUrl?: string | null;
    biography?: string;
    socials?: SetSocialsForUserParams;
    offers?: SetOffersForUserParams;
    asks?: SetAsksForUserParams;
}