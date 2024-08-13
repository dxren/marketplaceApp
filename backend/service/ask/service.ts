import type { Ask } from '../../../shared/types'
import { Prisma }  from '@prisma/client'
import { prismaClient } from '../../prismaClient';
import { PRISMA_SELECT_ASK } from '../../types';

export interface IAskService {
    getOne(id: string): Promise<Ask | null>;
    getAll(): Promise<Ask[]>;
    getAllByUser(id: string): Promise<Ask[]>;
    create(data: Prisma.AskUncheckedCreateInput): Promise<Ask>;
    tryUpdate(id: string, userId: string, data: Prisma.AskUpdateInput): Promise<Ask | null>;
    tryDelete(id: string, userId: string): Promise<Ask | null>;
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
    create: async (data: Prisma.AskUncheckedCreateInput) => {
        const result = await prismaClient.ask.create({
            data,
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    tryUpdate: async (id: string, userId: string, data: Prisma.AskUpdateInput) => {
        const result = await prismaClient.ask.update({
            where: {id, userId},
            data,
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    tryDelete: async (id: string, userId: string) => {
        const result = await prismaClient.ask.delete({
            where: {id, userId},
            select: PRISMA_SELECT_ASK
        });
        return result;
    }
});