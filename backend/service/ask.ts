import { Prisma } from '@prisma/client';
import type { Ask } from '../../shared/types'
import { prismaClient } from '../prismaClient';
import { CreateAskParams, PRISMA_SELECT_ASK, SetAsksForUserParams, UpdateAskParams } from '../types';

export interface IAskService {
    getOne(id: string): Promise<Ask | null>;
    getAll(): Promise<Ask[]>;
    getAllByUser(id: string): Promise<Ask[]>;
    create(data: CreateAskParams): Promise<Ask>;
    setForUser(id: string, asks: Ask[]): Promise<Ask[]>;
    delete(id: string): Promise<Ask | null>;
    update(id: string, params: UpdateAskParams): Promise<Ask | null>
}

export const AskService: () => IAskService = () => ({
    getOne: async (id: string) => {
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
    getAllByUser: async (userId: string) => {
        const result = await prismaClient.ask.findMany({
            where: {
                userId
            },
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    create: async (params: CreateAskParams) => {
        const {description, userId} = params;
        const data: Prisma.AskUncheckedCreateInput = {description, userId};
        const result = await prismaClient.ask.create({
            data,
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    setForUser: async (id: string, asks: SetAsksForUserParams[]) => {
        await prismaClient.ask.deleteMany({where: {id}});
        const transaction = prismaClient.$transaction([...asks.map(ask =>
            prismaClient.ask.create({
                data: {
                    description: ask.description,
                    userId: id
                },
                select: PRISMA_SELECT_ASK
            })
        )]);
        const result = (await transaction);
        return result;
    },
    delete: async (id: string) => {
        const result = await prismaClient.ask.delete({
            where: {id},
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    update: async (id: string, params: UpdateAskParams) => {
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