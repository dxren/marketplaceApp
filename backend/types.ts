export const PRISMA_SELECT_USER_SUMMARY = {
    id: true,
    avatarUrl: true,
    displayName: true,
    createdAt: true,
}

export const PRISMA_SELECT_POST = {
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
    userId: true,
}

export const PRISMA_SELECT_USER = {
    id: true,
    displayName: true,
    avatarUrl: true,
    biography: true,
    createdAt: true,
    socials: {select: PRISMA_SELECT_SOCIAL},
    posts: {select: PRISMA_SELECT_POST},
    offers: {select: PRISMA_SELECT_OFFER}
};

export type CreatePostParams = {
    title: string;
    description?: string;
    userId: string;
};
export type UpdatePostParams = Partial<Omit<CreatePostParams, 'userId'>>;
export type SetPostsForUserParams = Omit<CreatePostParams, 'userId'>[];

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
    posts?: SetPostsForUserParams;
}

