import { Social } from "../../shared/types";
import { prismaClient } from "../prismaClient";
import { PRISMA_SELECT_SOCIAL, SetSocialsForUserParams } from "../types";

export interface ISocialService {
    setForUser(id: string, socials: SetSocialsForUserParams[]): Promise<Social[]>
}

export const SocialService: () => ISocialService = () => ({
    setForUser: async(id, socials) => {
        const user = prismaClient.user.findUnique({where: {id}});
        if (!user) return [];
        await prismaClient.socials.deleteMany({where: {id}});
        const transaction = prismaClient.$transaction([...socials.map(social =>
            prismaClient.socials.create({
                data: {
                    name: social.name,
                    value: social.value,
                    userId: id
                },
                select: PRISMA_SELECT_SOCIAL
            })
        )]);
        const result = (await transaction);
        return result;
    }
})