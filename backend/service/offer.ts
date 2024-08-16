import { Prisma } from '@prisma/client';
import type { Offer } from '../../shared/types'
import { prismaClient } from '../prismaClient';
import { CreateOfferParams, SetOffersForUserParams, UpdateOfferParams } from '../types';
import { DEFAULT_PAGE_LIMIT, PRISMA_SELECT_OFFER } from "../constants";

export interface IOfferService {
    getOne(id: string): Promise<Offer | null>;
    getMany(offset?: number, limit?: number): Promise<Offer[]>;
    getManyByUser(id: string, offset?: number, limit?: number): Promise<Offer[]>;
    create(data: CreateOfferParams): Promise<Offer>;
    setForUser(userId: string, offers: SetOffersForUserParams): Promise<Offer[]>;
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
    getMany: async (offset = 0, limit = DEFAULT_PAGE_LIMIT) => {
        const result = await prismaClient.offer.findMany({
            select: PRISMA_SELECT_OFFER,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });
        return result;
    },
    getManyByUser: async (userId, offset = 0, limit = DEFAULT_PAGE_LIMIT) => {
        const result = await prismaClient.offer.findMany({
            where: { userId },
            select: PRISMA_SELECT_OFFER,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
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