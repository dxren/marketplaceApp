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
    avatarUrl?: string;
    biography?: string;
    socials?: SetSocialsForUserParams;
    offers?: SetOffersForUserParams;
    asks?: SetAsksForUserParams;
}