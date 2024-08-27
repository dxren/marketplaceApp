import { z } from "zod"

export const GetManyOptionsSchema = z.object({
    searchString: z.string().optional(),
    limit: z.number().int().optional(),
    offset: z.number().int().optional(),
});
export type GetManyOptions = z.infer<typeof GetManyOptionsSchema>;

/**  DATA TYPES **/

export const PostSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    createdAt: z.string().transform(x => new Date(x)),
    userId: z.string(),
});
export type Post = z.infer<typeof PostSchema>;

export const SocialSchema = z.object({
    id: z.string(),
    name: z.string(),
    value: z.string(),
    userId: z.string(),
});
export type Social = z.infer<typeof SocialSchema>;

export const UserSchema = z.object({
    id: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
    biography: z.string().default(''),
    createdAt: z.string().transform(x => new Date(x)),
    socials: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })),
});
export type User = z.infer<typeof UserSchema>

/** POST API **/

export const GetOnePostResponseSchema = PostSchema;
export type GetOnePostResponse = z.infer<typeof GetOnePostResponseSchema>;

export const GetManyPostResponseSchema = z.object({
    posts: z.array(PostSchema),
    totalCount: z.number(),
});
export type GetManyPostResponse = z.infer<typeof GetManyPostResponseSchema>;

export const CreatePostBodySchema = z.object({
    title: z.string(),
    description: z.string(),
}).strict();
export type CreatePostBody = z.infer<typeof CreatePostBodySchema>;

export const CreatePostResponseSchema = PostSchema;
export type CreatePostResponse = z.infer<typeof CreatePostResponseSchema>;

export const DeletePostResponseSchema = PostSchema;
export type DeletePostResponse = z.infer<typeof DeletePostResponseSchema>;

export const UpdatePostBodySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
}).strict();
export type UpdatePostBody = z.infer<typeof UpdatePostBodySchema>;

export const UpdatePostResponseSchema = PostSchema;
export type UpdatePostResponse = z.infer<typeof UpdatePostResponseSchema>;

export const FavoritePostResponseSchema = PostSchema;
export type FavoritePostResponse = z.infer<typeof FavoritePostResponseSchema>;

/** USER API **/

export const GetUserResponseSchema = UserSchema;
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

export const UpdateUserBodySchema = z.object({
    displayName: z.string().optional(),
    avatarUrl: z.string().optional(),
    biography: z.string().optional(),
    socials: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })).optional(),
}).strict();
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;

export const UpdateUserResponseSchema = UserSchema;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

export const GetUserFavoritesResponseSchema = z.array(PostSchema);
export type GetUserFavoritesResponse = z.infer<typeof GetUserFavoritesResponseSchema>;

/** SOCIAL API **/

export const DeleteSocialResponseSchema = SocialSchema;
export type DeleteSocialResponse = z.infer<typeof DeleteSocialResponseSchema>;

export const CreateSocialBodySchema = SocialSchema.strict();
export type CreateSocialBody = z.infer<typeof CreateSocialBodySchema>;

export const CreateSocialResponseSchema = SocialSchema;
export type CreateSocialResponse = z.infer<typeof CreateSocialResponseSchema>;

export const CreateCheckoutSessionBodySchema = z.object({});
export type CreateCheckoutSessionBody = z.infer<typeof CreateCheckoutSessionBodySchema>;