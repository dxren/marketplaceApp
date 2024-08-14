import { User, UserSummary } from "../../shared/types"
import { prismaClient } from "../prismaClient";
import { PRISMA_SELECT_USER, PRISMA_SELECT_USER_SUMMARY, UpdateUserParams } from "../types";
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
    update: async (id: string, data: UpdateUserParams) => {
        const userData = {
            displayName: data.displayName
        };
        await Promise.all([
            data.asks ? AskService().setForUser(id, data.asks) : null,
            data.offers ? OfferService().setForUser(id, data.offers) : null,
            data.socials ? SocialService().setForUser(id, data.socials): null
        ]);
        const result = await prismaClient.user.update({
            where: {id},
            data: userData,
            select: PRISMA_SELECT_USER
        });
        return result;
    }
})