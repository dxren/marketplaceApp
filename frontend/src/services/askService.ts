import { useAuth } from '@clerk/clerk-react'
import { Ask } from "../../../shared/types";
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
    },
    getAsksByUser: async (id: string) => {
        const url = ENDPOINTS_ASK.GET_ALL_BY_USER(id);
        const token = await getToken();
        const asks = await getAuthed<GetManyAskResponse>(url, token);
        return asks;
    },
    getAskById: async (id: string) => {
        const url = ENDPOINTS_ASK.GET_ONE(id);
        const token = await getToken();
        const ask = await getAuthed<GetOneAskResponse>(url, token);
        return ask;
    },
    createAskForCurrentUser: async (description: string) => {
        const url = ENDPOINTS_ASK.CREATE;
        const token = await getToken();
        const bodyObj: CreateAskBody = { description };
        const ask = await postAuthed<CreateAskResponse>(url, token, bodyObj);
        return ask;
    },
    updateAskForCurrentUser: async (id: string, description: string) => {
        const url = ENDPOINTS_ASK.UPDATE(id);
        const token = await getToken();
        const bodyObj: UpdateAskBody = { description };
        const ask = await putAuthed<UpdateAskResponse>(url, token, bodyObj);
        return ask;
    },
    deleteAskForCurrentUser: async (id: string) => {
        const url = ENDPOINTS_ASK.DELETE(id);
        const token = await getToken();
        const ask = await deleteAuthed<DeleteAskResponse>(url, token);
        return ask;
    },
    getAsks: async () => {
        const url = ENDPOINTS_ASK.GET_ALL;
        const token = await getToken();
        const asks = await getAuthed<GetManyAskResponse>(url, token);
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