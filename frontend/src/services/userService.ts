import { useAuth } from "@clerk/clerk-react";
import { parseDateStrings, getAuthed, getRequest, putAuthed } from "./utils";
import { ENDPOINTS_USER } from "./endpoints";
import { GetUserResponse, UpdateUserBody, UpdateUserResponse } from "../../../shared/apiTypes";
import { IAppStore, useAppStore } from "../appStore";

export interface IUserService {
    updateCurrentUser(userArgs: UpdateUserBody): Promise<void>;
    fetchUser(id: string): Promise<void>;
    fetchCurrentUser(): Promise<void>;
}

const UserService = (getToken: () => Promise<string>, appStore: IAppStore): IUserService => ({
    updateCurrentUser: async (userArgs: UpdateUserBody) => {
        const { displayName, avatarUrl, biography, asks, offers, socials } = userArgs;
        const url = ENDPOINTS_USER.UPDATE_CURRENT;
        const token = await getToken();
        const bodyObj: UpdateUserBody = { displayName, avatarUrl, biography, asks, offers, socials };
        console.log("Updating user with body:", bodyObj);

        try {
            const user = parseDateStrings(await putAuthed<UpdateUserResponse>(url, token, bodyObj)) ?? null;
            console.log("Updated user:", user);
            appStore.setCurrentUser(user);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    },
    fetchUser: async (id: string) => {
        const url = ENDPOINTS_USER.GET(id);
        console.log(`Fetching user by ID: ${id}`);
        const user = parseDateStrings(await getRequest<GetUserResponse>(url)) ?? null;
        console.log("Fetched user by ID:", user);
        appStore.setCurrentUser(user);
    },
    fetchCurrentUser: async () => {
        const url = ENDPOINTS_USER.GET_CURRENT;
        const token = await getToken();
        console.log("Fetching current user...");
        const user = parseDateStrings(await getAuthed<GetUserResponse>(url, token)) ?? null;
        console.log("Fetched current user:", user);
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