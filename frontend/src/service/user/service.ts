import { useAuth } from "@clerk/clerk-react";
import { User } from "../../../../shared/types";
import { users } from "../../../../shared/examples";

export interface IUserService {
    update: (displayName: string) => Promise<User>;
    get: () => Promise<User>;
}

const UserService = (getToken: () => Promise<string>): IUserService => ({
    update: async (displayName: string) => {
        const token = await getToken();
        const id = 'abc';
        console.log(`Update user with token ${token}.`);
        const toUpdateIndex = users.findIndex(user => user.id === id);
        if (toUpdateIndex === -1) throw new Error(`Unable to find user with id ${id}`);
        const updated: User = {...users[toUpdateIndex], displayName};
        users[toUpdateIndex] = updated;
        return updated;
    },
    get: async () => {
        const token = await getToken();
        console.log(`Get user with token ${token}.`);
        return users[0];
    }
});

export const useUserService = (): IUserService => {
    const { getToken } = useAuth();
    
    const getTokenOrThrow = async () => {
        const token = await getToken();
        if (!token) throw new Error('Unable to fetch Clerk token.');
        return token;
    }

    const userService = UserService(getTokenOrThrow);
    return userService;
}