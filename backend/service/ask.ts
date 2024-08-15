import { Prisma } from '@prisma/client';
import type { Ask } from '../../shared/types'
import { prismaClient } from '../prismaClient';
import { CreateAskParams, PRISMA_SELECT_ASK, SetAsksForUserParams, UpdateAskParams } from '../types';

export interface IAskService {
    getOne(id: string): Promise<Ask | null>;
    getAll(): Promise<Ask[]>;
    getAllByUser(id: string): Promise<Ask[]>;
    create(data: CreateAskParams): Promise<Ask>;
    setForUser(userId: string, asks: Ask[]): Promise<Ask[]>;
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
    getAll: async () => {
        const result = await prismaClient.ask.findMany({select: PRISMA_SELECT_ASK});
        return result;
    },
    getAllByUser: async (userId) => {
        const result = await prismaClient.ask.findMany({
            where: {
                userId
            },
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    create: async (params) => {
        const {description, userId} = params;
        const data: Prisma.AskUncheckedCreateInput = {description, userId};
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