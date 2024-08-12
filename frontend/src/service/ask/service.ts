import { useAuth } from '@clerk/clerk-react'
import { Ask } from "../../../../shared/types";
import { asks, user } from '../../../../shared/examples';

export interface IAskService {
    getAllByCurrentUser(): Promise<Ask[]>;
    getOneByCurrentUser(id: string): Promise<Ask | null>;
    create(description: string): Promise<Ask>;
    update(id: string, description: string): Promise<Ask>;
    delete(id: string): Promise<Ask>;
    getAll(): Promise<Ask[]>;
}

const AskService = (getToken: () => Promise<string>): IAskService => ({
    getAllByCurrentUser: async () => {
        const token = await getToken();
        console.log(`Get all with token ${token}`);
        return asks;
    },
    getOneByCurrentUser: async (id: string) => {
        const token = await getToken();
        console.log(`Get with token ${token}`);
        return asks.find(ask => ask.id === id) ?? null;
    },
    create: async (description: string) => {
        const token = await getToken();
        console.log(`Create with token ${token}`);
        const ask: Ask = {
            id: String(asks.length + 1),
            description,
            createdAt: new Date(),
            user
        }
        asks.push(ask);
        return ask;
    },
    update: async (id: string, description: string) => {
        const token = await getToken();
        console.log(`Update with token ${token}`);
        const toUpdateIndex = asks.findIndex(ask => ask.id === id);
        if (toUpdateIndex === -1) throw new Error(`Unable to find ask id ${id}.`);
        const updated: Ask = {...asks[toUpdateIndex], description};
        asks[toUpdateIndex] = updated;
        return asks[toUpdateIndex];
    },
    delete: async (id: string) => {
        const token = await getToken();
        console.log(`Delete with token ${token}`);
        const toDeleteIndex = asks.findIndex(ask => ask.id === id);
        if (toDeleteIndex === -1) throw new Error(`Unable to find ask id ${id}.`);
        const deleted = asks.splice(toDeleteIndex, 1)[0];
        return deleted;
    },
    getAll: async () => {
        const token = await getToken();
        console.log(`Get all with token ${token}`);
        return asks;
    }
})

export const useAskService = (): IAskService => {
    const { getToken } = useAuth();
    
    const getTokenOrThrow = async () => {
        const token = await getToken();
        if (!token) throw new Error('Unable to fetch Clerk token.');
        return token;
    }

    const askService = AskService(getTokenOrThrow);
    return askService;
}