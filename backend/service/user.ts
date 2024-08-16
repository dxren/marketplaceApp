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
        const result = await prismaClient.user.findUnique({
            where: {id},
            select: PRISMA_SELECT_USER
        });
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
            displayName: userData.displayName,
            avatarUrl: userData.avatarUrl,
            biography: userData.biography
        };
        await Promise.all([
            userData.asks ? AskService().setForUser(id, userData.asks) : null,
            userData.offers ? OfferService().setForUser(id, userData.offers) : null,
            userData.socials ? SocialService().setForUser(id, userData.socials): null
        ]);
        const result = await prismaClient.user.update({
            where: {id},
            data,
            select: PRISMA_SELECT_USER
        });
        return result;
    }
})