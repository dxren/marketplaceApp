import { useAuth } from "@clerk/clerk-react";
import { getAuthed, putAuthed } from "./utils";
import { ENDPOINTS_USER } from "./endpoints";
import { GetUserResponseSchema, UpdateUserBody, UpdateUserResponseSchema, User } from "../../../shared/apiTypes";
import { IAppStore, useAppStore } from "../appStore";

export interface IUserService {
    updateCurrentUser(userArgs: UpdateUserBody): Promise<void>;
    getUser(id: string): User | null;
    fetchCurrentUser(): Promise<void>;
}

const UserService = (getToken: () => Promise<string>, appStore: IAppStore): IUserService => ({
    updateCurrentUser: async (userArgs: UpdateUserBody) => {
        const { displayName, avatarUrl, biography, socials } = userArgs;
        const url = ENDPOINTS_USER.UPDATE_CURRENT;
        const token = await getToken();
        const bodyObj: UpdateUserBody = { displayName, avatarUrl, biography, socials };

        try {
            const user = await putAuthed(url, token, bodyObj, UpdateUserResponseSchema);
            appStore.setCurrentUser(user);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    },
    getUser: (id: string) => {
        const foundUser = appStore.fetchedUsers.find(user => user.id === id);
        console.error(`Attempt to access unfetched user ${id}.`);
        return foundUser ?? null;
    },
    fetchCurrentUser: async () => {
        const url = ENDPOINTS_USER.GET_CURRENT;
        const token = await getToken();
        const user = await getAuthed(url, token, GetUserResponseSchema);
        if (!user) return;
        appStore.setCurrentUser(user);
    }
});

export const useUserService = (): IUserService => {
    const { getToken } = useAuth();
    const appStore = useAppStore();
    
    const getTokenOrThrow = async () => {
        const token = await getToken();
        if (!token) throw new Error('Unable to fetch Clerk token.');
        return token;
    }

    const userService = UserService(getTokenOrThrow, appStore);
    return userService;
}