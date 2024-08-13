import type { Offer } from '../../shared/types'
import { prismaClient } from '../prismaClient';
import { CreateOfferParams, PRISMA_SELECT_OFFER, SetOffersForUserParams } from '../types';

export interface IOfferService {
    getOne(id: string): Promise<Offer | null>;
    getAll(): Promise<Offer[]>;
    getAllByUser(id: string): Promise<Offer[]>;
    create(data: CreateOfferParams): Promise<Offer>;
    setForUser(id: string, offers: Offer[]): Promise<Offer[]>;
    tryDelete(id: string, userId: string): Promise<Offer | null>;
}

export const OfferService: () => IOfferService = () => ({
    getOne: async (id: string) => {
        const result = await prismaClient.offer.findUnique({
            where: {id},
            select: PRISMA_SELECT_OFFER
        });
        return result;
    },
    getAll: async () => {
        const result = await prismaClient.offer.findMany({select: PRISMA_SELECT_OFFER});
        return result;
    },
    getAllByUser: async (userId: string) => {
        const result = await prismaClient.offer.findMany({
            where: {
                userId
            },
            select: PRISMA_SELECT_OFFER
        });
        return result;
    },
    create: async (data: CreateOfferParams) => {
        const result = await prismaClient.offer.create({
            data,
            select: PRISMA_SELECT_OFFER
        });
        return result;
    },
    setForUser: async (id: string, offers: SetOffersForUserParams[]) => {
        const user = prismaClient.user.findUnique({where: {id}});
        if (!user) return [];
        await prismaClient.offer.deleteMany({where: {id}});
        const transaction = prismaClient.$transaction([...offers.map(offer =>
            prismaClient.offer.create({
                data: {
                    description: offer.description,
                    userId: id
                },
                select: PRISMA_SELECT_OFFER
            })
        )]);
        const result = (await transaction);
        return result;
    },
    tryDelete: async (id: string, userId: string) => {
        const result = await prismaClient.offer.delete({
            where: {id, userId},
            select: PRISMA_SELECT_OFFER
        });
        return result;
    }
});