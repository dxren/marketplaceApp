import type { Offer } from '../../../shared/types'
import { Prisma }  from '@prisma/client'
import { prismaClient } from '../../prismaClient';
import { PRISMA_SELECT_ASK } from '../../types';

export interface IOfferService {
    getOne(id: string): Promise<Offer | null>;
    getAll(): Promise<Offer[]>;
    getAllByUser(id: string): Promise<Offer[]>;
    create(data: Prisma.OfferUncheckedCreateInput): Promise<Offer>;
    tryUpdate(id: string, userId: string, data: Prisma.OfferUpdateInput): Promise<Offer | null>;
    tryDelete(id: string, userId: string): Promise<Offer | null>;
}

export const OfferService: () => IOfferService = () => ({
    getOne: async (id: string) => {
        const result = await prismaClient.offer.findUnique({
            where: {id},
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    getAll: async () => {
        const result = await prismaClient.offer.findMany({select: PRISMA_SELECT_ASK});
        return result;
    },
    getAllByUser: async (userId: string) => {
        const result = await prismaClient.offer.findMany({
            where: {
                userId
            },
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    create: async (data: Prisma.OfferUncheckedCreateInput) => {
        const result = await prismaClient.offer.create({
            data,
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    tryUpdate: async (id: string, userId: string, data: Prisma.OfferUpdateInput) => {
        const result = await prismaClient.offer.update({
            where: {id, userId},
            data,
            select: PRISMA_SELECT_ASK
        });
        return result;
    },
    tryDelete: async (id: string, userId: string) => {
        const result = await prismaClient.offer.delete({
            where: {id, userId},
            select: PRISMA_SELECT_ASK
        });
        return result;
    }
});