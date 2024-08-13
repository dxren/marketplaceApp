import { Ask, Offer, User } from "./types";

export type GetOneAskResponse = Ask;
export type GetManyAskResponse = Ask[];
export type CreateAskBody = {description: string};
export type CreateAskResponse = Ask;
export type DeleteAskResponse = Ask;
export type UpdateAskBody = {description: string};
export type UpdateAskResponse = Ask;

export type GetOneOfferResponse = Offer;
export type GetManyOfferResponse = Offer[];
export type CreateOfferBody = {description: string};
export type CreateOfferResponse = Offer;
export type DeleteOfferResponse = Offer;
export type UpdateOfferBody = {description: string};
export type UpdateOfferResponse = Offer;

export type GetUserResponse = User;
export type UpdateUserBody = Partial<Omit<User, 'id'>>;
export type UpdateUserResponse = User;