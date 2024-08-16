import { Prisma } from '@prisma/client';
import type { Ask } from '../../shared/types'
import { prismaClient } from '../prismaClient';
import { CreateAskParams, SetAsksForUserParams, UpdateAskParams } from '../types';
import { DEFAULT_PAGE_LIMIT, PRISMA_SELECT_ASK } from "../constants";

export interface IAskService {
    getOne(id: string): Promise<Ask | null>;
    getMany(offset?: number, limit?: number): Promise<Ask[]>;
    getManyByUser(id: string, offset?: number, limit?: number): Promise<Ask[]>;
    create(data: CreateAskParams): Promise<Ask>;
    setForUser(userId: string, asks: SetAsksForUserParams): Promise<Ask[]>;
    delete(id: string): Promise<Ask | null>;
    update(id: string, params: UpdateAskParams): Promise<Ask | null>
}

export const AskService: () => IAskService = () => ({
    getOne: async (id) => {
        const result = await prismaClient.ask.findUnique({
            where: {id},
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    getMany: async (offset = 0, limit = DEFAULT_PAGE_LIMIT) => {
        const result = await prismaClient.ask.findMany({
            select: PRISMA_SELECT_ASK,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });
        return result;
    },
    getManyByUser: async (userId, offset = 0, limit = DEFAULT_PAGE_LIMIT) => {
        const result = await prismaClient.ask.findMany({
            where: { userId },
            select: PRISMA_SELECT_ASK,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });
        return result;
    },
    create: async (params) => {
        const {title, description, userId} = params;
        const data: Prisma.AskUncheckedCreateInput = {title, description, userId};
        const result = await prismaClient.ask.create({
            data,
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    setForUser: async (userId, asks) => {
        await prismaClient.ask.deleteMany({where: {userId}});
        const transaction = prismaClient.$transaction([...asks.map(ask =>
            prismaClient.ask.create({
                data: {
                    title: ask.title,
                    description: ask.description,
                    userId
                },
                select: PRISMA_SELECT_ASK
            })
        )]);
        const result = (await transaction);
        return result;
    },
    delete: async (id) => {
        const result = await prismaClient.ask.delete({
            where: {id},
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    update: async (id, params) => {
        const { description } = params;
        const data: Prisma.AskUpdateInput = { description }
        const result = await prismaClient.ask.update({
            where: {id},
            data,
            select: PRISMA_SELECT_ASK
        });
        return result;
    }
});