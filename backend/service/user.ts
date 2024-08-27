import { prismaClient } from "../prismaClient";
import { UpdateUserParams } from "../types";
import { PRISMA_SELECT_USER } from "../constants";
import { PostService } from "./post";
import { SocialService } from "./social";
import { User } from "../../shared/apiTypes";


export interface IUserService {
    get(id: string): Promise<User | null>;
    update(id: string, data: UpdateUserParams): Promise<User | null>;
}

export const UserService: () => IUserService = () => ({
    get: async (id: string) => {
        const [user, favoritePosts, socials] = await Promise.all([
            prismaClient.user.findUnique({
                where: {id},
                select: PRISMA_SELECT_USER
            }),
            PostService().getFavoritedByUser(id, {}).then(val => val.map(post => post.id)),
            SocialService().getAllForUser(id)
        ]);
        if (!user) return null;
        const result = {...user, favoritePosts, socials};
        return result;
    },
    update: async (id: string, userData: UpdateUserParams) => {
        const data = {
            avatarUrl: userData.avatarUrl,
            displayName: userData.displayName,
            biography: userData.biography
        };
        await Promise.all([
            userData.posts ? PostService().setForUser(id, userData.posts) : null,
            userData.socials ? SocialService().setForUser(id, userData.socials): null
        ]);
        const [user, favoritePosts, socials] = await Promise.all([
            prismaClient.user.update({
                where: {id},
                data,
                select: PRISMA_SELECT_USER
            }),
            PostService().getFavoritedByUser(id, {}).then(val => val.map(post => post.id)),
            SocialService().getAllForUser(id)
        ]);
        if (!user) return null;
        const result = {...user, favoritePosts, socials};
        return result;
    }
})