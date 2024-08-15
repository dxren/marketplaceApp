import { Prisma } from '@prisma/client';
import type { Offer } from '../../shared/types'
import { prismaClient } from '../prismaClient';
import { CreateOfferParams, PRISMA_SELECT_OFFER, SetOffersForUserParams, UpdateOfferParams } from '../types';

export interface IOfferService {
    getOne(id: string): Promise<Offer | null>;
    getAll(): Promise<Offer[]>;
    getAllByUser(id: string): Promise<Offer[]>;
    create(data: CreateOfferParams): Promise<Offer>;
    setForUser(userId: string, offers: Offer[]): Promise<Offer[]>;
    delete(id: string): Promise<Offer | null>;
    update(id: string, params: UpdateOfferParams): Promise<Offer | null>
}

export const OfferService: () => IOfferService = () => ({
    getOne: async (id) => {
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
    getAllByUser: async (userId) => {
        const result = await prismaClient.offer.findMany({
            where: {
                userId
            },
            select: PRISMA_SELECT_OFFER
        });
        return result;
    },
    create: async (params) => {
        const {title, description, userId} = params;
        const data: Prisma.OfferUncheckedCreateInput = {title, description, userId};
        const result = await prismaClient.offer.create({
            data,
            select: PRISMA_SELECT_OFFER
        });
        return result;
    },
    setForUser: async (userId, offers) => {
        await prismaClient.offer.deleteMany({where: {userId}});
        const transaction = prismaClient.$transaction([...offers.map(offer =>
            prismaClient.offer.create({
                data: {
                    title: offer.title,
                    description: offer.description,
                    userId
                },
                select: PRISMA_SELECT_OFFER
            })
        )]);
        const result = (await transaction);
        return result;
    },
    delete: async (id) => {
        const result = await prismaClient.offer.delete({
            where: {id},
            select: PRISMA_SELECT_OFFER
        });
        return result;
    },
    update: async (id, params) => {
        const { description } = params;
        const data: Prisma.OfferUpdateInput = { description }
        const result = await prismaClient.offer.update({
            where: {id},
            data,
            select: PRISMA_SELECT_OFFER
        });
        return result;
    }
});