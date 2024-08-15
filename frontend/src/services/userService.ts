import { useAuth } from "@clerk/clerk-react";
import { User } from "../../../shared/types";
import { getAuthed, putAuthed } from "./utils";
import { ENDPOINTS_USER } from "./endpoints";
import { GetUserResponse, UpdateUserBody, UpdateUserResponse } from "../../../shared/apiTypes";

export interface IUserService {
    updateCurrentUser(userArgs: Partial<Omit<User, 'id'>>): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    getCurrentUser(): Promise<User | null>;
}

const UserService = (getToken: () => Promise<string>): IUserService => ({
    updateCurrentUser: async (userArgs: Partial<Omit<User, 'id'>>) => {
        const { displayName, asks, offers, socials } = userArgs;
        const url = ENDPOINTS_USER.UPDATE_CURRENT;
        const token = await getToken();
        const bodyObj: UpdateUserBody = { displayName, asks, offers, socials };
        console.log("Updating user with body:", bodyObj);

        try {
            const user = await putAuthed<UpdateUserResponse>(url, token, bodyObj);
            console.log("Updated user:", user);
            return user;
        } catch (error) {
            console.error("Error updating user:", error);
            return null;
        }
    },
    getUserById: async (id: string) => {
        const url = ENDPOINTS_USER.GET(id);
        const token = await getToken();
        console.log(`Fetching user by ID: ${id}`);
        const user = await getAuthed<GetUserResponse>(url, token);
        console.log("Fetched user by ID:", user);
        return user;
    },
    getCurrentUser: async () => {
        const url = ENDPOINTS_USER.GET_CURRENT;
        const token = await getToken();
        console.log("Fetching current user...");
        const user = await getAuthed<GetUserResponse>(url, token);
        console.log("Fetched current user:", user);
        return user;
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