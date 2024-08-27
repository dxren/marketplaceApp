import { z } from "zod"

export const GetManyOptions = z.object({
    searchString: z.string().optional(),
    limit: z.number().int().optional(),
    offset: z.number().int().optional(),
});
export type GetManyOptions = z.infer<typeof GetManyOptions>;

/**  DATA TYPES **/

export const AskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    createdAt: z.string().transform(x => new Date(x)),
    userId: z.string(),
});
export type Ask = z.infer<typeof AskSchema>;

export const SocialSchema = z.object({
    name: z.string(),
    value: z.string(),
});
export type Social = z.infer<typeof SocialSchema>;

export const UserSchema = z.object({
    id: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().optional(),
    biography: z.string().default(''),
    createdAt: z.string().transform(x => new Date(x)),
    socials: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })),
});
export type User = z.infer<typeof UserSchema>

/** ASK API **/

export const GetOneAskResponse = AskSchema;
export type GetOneAskResponse = z.infer<typeof GetOneAskResponse>;

export const GetManyAskResponse = z.array(AskSchema);
export type GetManyAskResponse = z.infer<typeof GetManyAskResponse>;

export const CreateAskBody = z.object({
    title: z.string(),
    description: z.string(),
    userId: z.string()
});
export type CreateAskBody = z.infer<typeof CreateAskBody>;

export const CreateAskResponse = AskSchema;
export type CreateAskResponse = z.infer<typeof CreateAskResponse>;

export const DeleteAskResponse = AskSchema;
export type DeleteAskResponse = z.infer<typeof DeleteAskResponse>;

export const UpdateAskBody = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
});
export type UpdateAskBody = z.infer<typeof UpdateAskBody>;

export const UpdateAskResponse = AskSchema;
export type UpdateAskResponse = z.infer<typeof UpdateAskResponse>;

export const FavoriteAskResponse = AskSchema;
export type FavoriteAskResponse = z.infer<typeof FavoriteAskResponse>;

/** USER API **/

export const GetUserResponse = UserSchema;
export type GetUserResponse = z.infer<typeof GetUserResponse>;

export const UpdateUserBody = z.object({
    displayName: z.string().optional(),
    avatarUrl: z.string().optional(),
    biography: z.string().optional(),
    socials: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })).optional(),
});
export type UpdateUserBody = z.infer<typeof UpdateUserBody>;

export const UpdateUserResponse = UserSchema;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponse>;

export const GetUserFavoritesResponse = z.array(AskSchema);
export type GetUserFavoritesResponse = z.infer<typeof GetUserFavoritesResponse>;

/** SOCIAL API **/

export const DeleteSocialResponse = SocialSchema;
export type DeleteSocialResponse = z.infer<typeof DeleteSocialResponse>;

export const CreateSocialBody = SocialSchema;
export type CreateSocialBody = z.infer<typeof CreateSocialBody>;

export const CreateSocialResponse = SocialSchema;
export type CreateSocialResponse = z.infer<typeof CreateSocialResponse>;

export const CreateCheckoutSessionBody = z.object({});
export type CreateCheckoutSessionBody = z.infer<typeof CreateCheckoutSessionBody>;