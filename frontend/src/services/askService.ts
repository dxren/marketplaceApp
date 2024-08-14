import { useAuth } from '@clerk/clerk-react'
import { Ask } from "../../../shared/types";
// import { asks, user } from '../../../../shared/examples';
import { deleteAuthed, getAuthed, postAuthed, putAuthed } from './utils';
import { ENDPOINTS_ASK } from './endpoints';
import { CreateAskBody, CreateAskResponse, DeleteAskResponse, GetManyAskResponse, GetOneAskResponse, UpdateAskBody, UpdateAskResponse } from '../../../shared/apiTypes';

export interface IAskService {
    getAsksByCurrentUser(): Promise<Ask[] | null>;
    getAsksByUser(id: string): Promise<Ask[] | null>; 
    getAskById(id: string): Promise<Ask | null>;
    createAskForCurrentUser(description: string): Promise<Ask | null>;
    updateAskForCurrentUser(id: string, description: string): Promise<Ask | null>;
    deleteAskForCurrentUser(id: string): Promise<Ask | null>;
    getAsks(): Promise<Ask[] | null>;
}


const AskService = (getToken: () => Promise<string>): IAskService => ({
    getAsksByCurrentUser: async () => {
        const url = ENDPOINTS_ASK.GET_ALL_BY_CURRENT_USER;
        const token = await getToken();
        const asks = await getAuthed<GetManyAskResponse>(url, token);
        return asks;
        // console.log(`Get all with token ${token}`);
        // return asks;
    },
    getAsksByUser: async (id: string) => {
        const url = ENDPOINTS_ASK.GET_ALL_BY_USER(id);
        const token = await getToken();
        const asks = await getAuthed<GetManyAskResponse>(url, token);
        return asks;
        // console.log(`Get all with token ${token}`);
        // return asks;
    },
    getAskById: async (id: string) => {
        const url = ENDPOINTS_ASK.GET_ONE(id);
        const token = await getToken();
        const ask = await getAuthed<GetOneAskResponse>(url, token);
        return ask;
        // console.log(`Get with token ${token}`);
        // return asks.find(ask => ask.id === id) ?? null;
    },
    createAskForCurrentUser: async (description: string) => {
        const url = ENDPOINTS_ASK.CREATE;
        const token = await getToken();
        const bodyObj: CreateAskBody = { description };
        const ask = await postAuthed<CreateAskResponse>(url, token, bodyObj);
        return ask;
        // console.log(`Create with token ${token}`);
        // const ask: Ask = {
        //     id: String(asks.length + 1),
        //     description,
        //     createdAt: new Date(),
        //     user
        // }
        // asks.push(ask);
        // return ask;
    },
    updateAskForCurrentUser: async (id: string, description: string) => {
        const url = ENDPOINTS_ASK.UPDATE(id);
        const token = await getToken();
        const bodyObj: UpdateAskBody = { description };
        const ask = await putAuthed<UpdateAskResponse>(url, token, bodyObj);
        return ask;
        // console.log(`Update with token ${token}`);
        // const toUpdateIndex = asks.findIndex(ask => ask.id === id);
        // if (toUpdateIndex === -1) throw new Error(`Unable to find ask id ${id}.`);
        // const updated: Ask = {...asks[toUpdateIndex], description};
        // asks[toUpdateIndex] = updated;
        // return asks[toUpdateIndex];
    },
    deleteAskForCurrentUser: async (id: string) => {
        const url = ENDPOINTS_ASK.DELETE(id);
        const token = await getToken();
        const ask = await deleteAuthed<DeleteAskResponse>(url, token);
        return ask;
        // console.log(`Delete with token ${token}`);
        // const toDeleteIndex = asks.findIndex(ask => ask.id === id);
        // if (toDeleteIndex === -1) throw new Error(`Unable to find ask id ${id}.`);
        // const deleted = asks.splice(toDeleteIndex, 1)[0];
        // return deleted;
    },
    getAsks: async () => {
        const url = ENDPOINTS_ASK.GET_ALL;
        const token = await getToken();
        const asks = await getAuthed<GetManyAskResponse>(url, token);
        return asks;
        // console.log(`Get all with token ${token}`);
        // return asks;
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