import { useAuth } from "@clerk/clerk-react";
import { User } from "../../../shared/types";
// import { users } from "../../../../shared/examples";
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
        const url = ENDPOINTS_USER.UPDATE;
        const token = await getToken();
        const bodyObj: UpdateUserBody = { displayName, asks, offers, socials };
        const user = await putAuthed<UpdateUserResponse>(url, token, bodyObj);
        return user;
        // const id = 'abc';
        // console.log(`Update user with token ${token}.`);
        // const toUpdateIndex = users.findIndex(user => user.id === id);
        // if (toUpdateIndex === -1) throw new Error(`Unable to find user with id ${id}`);
        // const updated: User = {...users[toUpdateIndex], ...userArgs};
        // users[toUpdateIndex] = updated;
        // return updated;
    },
    getUserById: async (id: string) => {
        const url = ENDPOINTS_USER.GET(id);
        const token = await getToken();
        const user = await getAuthed<GetUserResponse>(url, token);
        return user;
        // console.log(`Get user with token ${token}.`);
        // return users[0];
    },
    getCurrentUser: async () => {
        const url = ENDPOINTS_USER.GET_CURRENT;
        const token = await getToken();
        const user = await getAuthed<GetUserResponse>(url, token);
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