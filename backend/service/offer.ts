import { Prisma } from '@prisma/client';
import type { Offer } from '../../shared/types'
import { prismaClient } from '../prismaClient';
import { CreateOfferParams, SetOffersForUserParams, UpdateOfferParams } from '../types';
import { DEFAULT_PAGE_LIMIT, PRISMA_SELECT_OFFER, PRISMA_WHERE_TITLE_OR_DESCRIPTION_CONTAINS_SUBSTRING } from "../constants";
import { GetManyOptions } from '../../shared/apiTypes';

export interface IOfferService {
    getOne(id: string): Promise<Offer | null>;
    getMany(options: GetManyOptions): Promise<Offer[]>;
    getManyByUser(id: string, options: GetManyOptions): Promise<Offer[]>;
    create(data: CreateOfferParams): Promise<Offer>;
    setForUser(userId: string, offers: SetOffersForUserParams): Promise<Offer[]>;
    delete(id: string): Promise<Offer | null>;
    update(id: string, params: UpdateOfferParams): Promise<Offer | null>;
    getCount(): Promise<number>;
}

export const OfferService: () => IOfferService = () => ({
    getOne: async (id) => {
        const result = await prismaClient.offer.findUnique({
            where: {id},
            select: PRISMA_SELECT_OFFER
        });
        return result;
    },
    getMany: async (options) => {
        const { offset = 0, limit = DEFAULT_PAGE_LIMIT, searchString = '' } = options;
        const result = await prismaClient.offer.findMany({
            where: PRISMA_WHERE_TITLE_OR_DESCRIPTION_CONTAINS_SUBSTRING(searchString),
            select: PRISMA_SELECT_OFFER,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });
        return result;
    },
    getManyByUser: async (userId, options) => {
        const { offset = 0, limit = DEFAULT_PAGE_LIMIT, searchString = '' } = options;
        const result = await prismaClient.offer.findMany({
            where: { userId, ...PRISMA_WHERE_TITLE_OR_DESCRIPTION_CONTAINS_SUBSTRING(searchString) },
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
        const { title, description } = params;
        const data: Prisma.OfferUpdateInput = { title, description }
        const result = await prismaClient.offer.update({
            where: {id},
            data,
            select: PRISMA_SELECT_OFFER
        });
        return result;
    },
    getCount: async () => {
        const result = await prismaClient.offer.count();
        return result;
    }
});