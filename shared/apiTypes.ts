import {
  Ask,
  Offer,
  Social,
  User,
  PriceOption,
  AskOfferComment,
} from "./types";

type WithDateStrings<T> = Omit<T, "createdAt"> & { createdAt: string };

export type GetManyOptions = {
  offset?: number;
  limit?: number;
  searchString?: string;
};

export type GetOneAskResponse = WithDateStrings<Ask>;
export type GetManyAskResponse = {
  asks: WithDateStrings<Ask>[];
  count: number;
};
export type CreateAskBody = { title: string; description?: string };
export type CreateAskResponse = WithDateStrings<Ask>;
export type DeleteAskResponse = WithDateStrings<Ask>;
export type UpdateAskBody = { title?: string; description?: string };
export type UpdateAskResponse = WithDateStrings<Ask>;
export type FavoriteAskResponse = string;

export type GetOneOfferResponse = WithDateStrings<Offer>;
export type GetManyOfferResponse = {
  offers: WithDateStrings<Offer>[];
  count: number;
};
export type CreateOfferBody = { title: string; description?: string };
export type CreateOfferResponse = WithDateStrings<Offer>;
export type DeleteOfferResponse = WithDateStrings<Offer>;
export type UpdateOfferBody = { title?: string; description?: string };
export type UpdateOfferResponse = WithDateStrings<Offer>;
export type FavoriteOfferResponse = string;

export type GetUserResponse = WithDateStrings<User>;
export type UpdateUserBody = {
  displayName?: string;
  avatarUrl?: string | null;
  biography?: string;
  asks?: CreateAskBody[];
  offers?: CreateOfferBody[];
  socials?: CreateSocialBody[];
};
export type UpdateUserResponse = WithDateStrings<User>;
export type GetUserFavoritesResponse = { asks: Ask[]; offers: Offer[] };

export type DeleteSocialRespone = Social;
export type CreateSocialBody = { name: string; value: string };
export type CreateSocialResponse = Social;
export type UpdateSocialBody = { name?: string; value?: string };
export type UpdateSocialResponse = Social;

export type CreateCheckoutSessionBody = PriceOption;

//Comments
export enum CommentType {
  "Ask",
  "Offer",
  "Comment",
}
export type CreateCommentResponse = WithDateStrings<AskOfferComment>;
// export type CreateCommentBody = { content: string; parentType: CommentType };
export type GetManyCommentResponse = {
  comments: WithDateStrings<AskOfferComment>[];
  count: number;
};
export type UpdateCommentResponse = WithDateStrings<AskOfferComment>;
export type DeleteCommentResponse = WithDateStrings<AskOfferComment>;
