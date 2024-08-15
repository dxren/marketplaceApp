import { Ask, Offer, Social, User } from "./types";

export type GetOneAskResponse = Ask;
export type GetManyAskResponse = Ask[];
export type CreateAskBody = {title: string, description?: string};
export type CreateAskResponse = Ask;
export type DeleteAskResponse = Ask;
export type UpdateAskBody = {title?: string, description?: string};
export type UpdateAskResponse = Ask;

export type GetOneOfferResponse = Offer;
export type GetManyOfferResponse = Offer[];
export type CreateOfferBody = {title: string, description?: string};
export type CreateOfferResponse = Offer;
export type DeleteOfferResponse = Offer;
export type UpdateOfferBody = {title?: string, description?: string};
export type UpdateOfferResponse = Offer;

export type GetUserResponse = User;
export type UpdateUserBody = {
    displayName?: string;
    biography?: string;
    asks?: CreateAskBody[];
    offers?: CreateOfferBody[];
    socials?: CreateSocialBody[];
}
export type UpdateUserResponse = User;

export type DeleteSocialRespone = Social;
export type CreateSocialBody = { name: string, value: string };
export type CreateSocialResponse = Social;
export type UpdateSocialBody = { name?: string, value?: string };
export type UpdateSocialResponse = Social;