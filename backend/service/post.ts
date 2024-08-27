import { Prisma } from '@prisma/client';
import type { Post } from '../../shared/apiTypes'
import { prismaClient } from '../prismaClient';
import { CreatePostParams, SetPostsForUserParams, UpdatePostParams } from '../types';
import { DEFAULT_PAGE_LIMIT, PRISMA_SELECT_POST, PRISMA_WHERE_TITLE_OR_DESCRIPTION_CONTAINS_SUBSTRING } from "../constants";
import { GetManyOptions } from '../../shared/apiTypes';

export interface IPostService {
    getOne(id: string): Promise<Post | null>;
    getMany(options: GetManyOptions): Promise<Post[]>;
    getManyByUser(id: string, options: GetManyOptions): Promise<Post[]>;
    create(data: CreatePostParams): Promise<Post>;
    setForUser(userId: string, posts: SetPostsForUserParams): Promise<Post[]>;
    delete(id: string): Promise<Post>;
    update(id: string, params: UpdatePostParams): Promise<Post>;
    getCount(): Promise<number>;
    getFavoritedByUser(userId: string, options: GetManyOptions): Promise<Post[]>;
    addFavorite(postId: string, userId: string): Promise<string>;
    removeFavorite(postId: string, userId: string): Promise<string>;
    getFavoritedByCount(userId: string): Promise<number>;
}

export const PostService: () => IPostService = () => ({
    getOne: async (id) => {
        const result = await prismaClient.post.findUnique({
            where: {id},
            select: PRISMA_SELECT_POST
        });
        return result;
    },
    getMany: async (options) => {
        const { offset = 0, limit = DEFAULT_PAGE_LIMIT, searchString = '' } = options;
        const result = await prismaClient.post.findMany({
            where: PRISMA_WHERE_TITLE_OR_DESCRIPTION_CONTAINS_SUBSTRING(searchString),
            select: PRISMA_SELECT_POST,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });
        return result;
    },
    getManyByUser: async (userId, options) => {
        const { offset = 0, limit = DEFAULT_PAGE_LIMIT, searchString = '' } = options;
        const result = await prismaClient.post.findMany({
            where: { userId, ...PRISMA_WHERE_TITLE_OR_DESCRIPTION_CONTAINS_SUBSTRING(searchString) },
            select: PRISMA_SELECT_POST,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });
        return result;
    },
    create: async (params) => {
        const {title, description, userId} = params;
        const data: Prisma.PostUncheckedCreateInput = {title, description, userId};
        const result = await prismaClient.post.create({
            data,
            select: PRISMA_SELECT_POST
        });
        return result;
    },
    setForUser: async (userId, posts) => {
        await prismaClient.post.deleteMany({where: {userId}});
        const transaction = prismaClient.$transaction([...posts.map(post =>
            prismaClient.post.create({
                data: {
                    title: post.title,
                    description: post.description,
                    userId
                },
                select: PRISMA_SELECT_POST
            })
        )]);
        const result = (await transaction);
        return result;
    },
    delete: async (id) => {
        const result = await prismaClient.post.delete({
            where: {id},
            select: PRISMA_SELECT_POST
        });
        return result;
    },
    update: async (id, params) => {
        const { title, description } = params;
        const data: Prisma.PostUpdateInput = { title, description }
        const result = await prismaClient.post.update({
            where: {id},
            data,
            select: PRISMA_SELECT_POST
        });
        return result;
    },
    getCount: async () => {
        const result = await prismaClient.post.count();
        return result;
    },
    getFavoritedByUser: async (userId, options) => {
        const {offset = 0, limit = DEFAULT_PAGE_LIMIT, searchString = ''} = options;
        const result = (await prismaClient.favoritePost.findMany({
            where: {userId},
            select: {
                post: {
                    select: PRISMA_SELECT_POST
                }
            },
            skip: offset,
            take: limit
        })).map(item => item.post);
        return result;
    },
    addFavorite: async (postId, userId) => {
        const result = (await prismaClient.favoritePost.create({
            data: {postId, userId},
            select: {post: {select: PRISMA_SELECT_POST}}
        })).post;
        return result.id;
    },
    removeFavorite: async (postId, userId) => {
        const result = (await prismaClient.favoritePost.delete({
            where: {userId_postId: {userId, postId}},
            select: {post: {select: PRISMA_SELECT_POST}}
        })).post;
        return result.id;
    },
    getFavoritedByCount: async (userId) => {
        const result = await prismaClient.favoritePost.count({
            where: {userId}
        });
        return result;
    }
});