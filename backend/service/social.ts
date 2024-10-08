import { Prisma } from "@prisma/client";
import { Social } from "../../shared/types";
import { prismaClient } from "../prismaClient";
import { CreateSocialParams, SetSocialsForUserParams, UpdateSocialParams } from "../types";
import { PRISMA_SELECT_SOCIAL } from "../constants";

export interface ISocialService {
    setForUser(userId: string, socials: SetSocialsForUserParams): Promise<Social[]>
    delete(id: string): Promise<Social>;
    create(params: CreateSocialParams): Promise<Social>;
    update(id: string, params: UpdateSocialParams): Promise<Social>;
    get(id: string): Promise<Social | null>;
}

export const SocialService: () => ISocialService = () => ({
    setForUser: async(userId, socials) => {
        const user = prismaClient.user.findUnique({where: {id: userId}});
        if (!user) return [];
        await prismaClient.socials.deleteMany({where: {userId}});
        const transaction = prismaClient.$transaction([...socials.map(social =>
            prismaClient.socials.create({
                data: {
                    name: social.name,
                    value: social.value,
                    userId
                },
                select: PRISMA_SELECT_SOCIAL
            })
        )]);
        const result = (await transaction);
        return result;
    },
    delete: async (id: string) => {
        const result = await prismaClient.socials.delete({
            where: {id},
            select: PRISMA_SELECT_SOCIAL
        });
        return result;
    },
    update: async (id: string, params: UpdateSocialParams) => {
        const { name, value } = params;
        const data: Prisma.SocialsUpdateInput = { name, value };
        const result = await prismaClient.socials.update({
            where: {id},
            data,
            select: PRISMA_SELECT_SOCIAL
        });
        return result;
    },
    create: async (params: CreateSocialParams) => {
        const { name, value, userId } = params;
        const data: Prisma.SocialsUncheckedCreateInput = { name, value, userId };
        const result = await prismaClient.socials.create({
            data,
            select: PRISMA_SELECT_SOCIAL
        });
        return result;
    },
    get: async (id: string) => {
        const result = await prismaClient.socials.findUnique({
            where: {id},
            select: PRISMA_SELECT_SOCIAL
        });
        return result;
    }
})