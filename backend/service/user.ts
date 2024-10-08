import { User, UserSummary } from "../../shared/types"
import { prismaClient } from "../prismaClient";
import { UpdateUserParams } from "../types";
import { PRISMA_SELECT_USER, PRISMA_SELECT_USER_SUMMARY } from "../constants";
import { AskService } from "./ask";
import { OfferService } from "./offer";
import { SocialService } from "./social";


export interface IUserService {
    get(id: string): Promise<User | null>;
    getSummary(id: string): Promise<UserSummary | null>;
    update(id: string, data: UpdateUserParams): Promise<User | null>;
}

export const UserService: () => IUserService = () => ({
    get: async (id: string) => {
        const [user, favoriteAsks, favoriteOffers] = await Promise.all([
            prismaClient.user.findUnique({
                where: {id},
                select: PRISMA_SELECT_USER
            }),
            AskService().getFavoritedByUser(id, {}).then(val => val.map(ask => ask.id)),
            OfferService().getFavoritedByUser(id, {}).then(val => val.map(offer => offer.id))
        ]);
        if (!user) return null;
        const result = {...user, favoriteAsks, favoriteOffers};
        return result;
    },
    getSummary: async (id: string) => {
        const result = await prismaClient.user.findUnique({
            where: {id},
            select: PRISMA_SELECT_USER_SUMMARY
        });
        return result;
    },
    update: async (id: string, userData: UpdateUserParams) => {
        const data = {
            avatarUrl: userData.avatarUrl,
            displayName: userData.displayName,
            biography: userData.biography
        };
        await Promise.all([
            userData.asks ? AskService().setForUser(id, userData.asks) : null,
            userData.offers ? OfferService().setForUser(id, userData.offers) : null,
            userData.socials ? SocialService().setForUser(id, userData.socials): null
        ]);
        const [user, favoriteAsks, favoriteOffers] = await Promise.all([
            prismaClient.user.update({
                where: {id},
                data,
                select: PRISMA_SELECT_USER
            }),
            AskService().getFavoritedByUser(id, {}).then(val => val.map(ask => ask.id)),
            OfferService().getFavoritedByUser(id, {}).then(val => val.map(offer => offer.id))
        ]);
        if (!user) return null;
        const result = {...user, favoriteAsks, favoriteOffers};
        return result;
    }
})