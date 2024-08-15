import { useAuth } from '@clerk/clerk-react'
import { Social } from '../../../shared/types';
import { CreateSocialBody, CreateSocialResponse, DeleteSocialRespone, UpdateSocialBody, UpdateSocialResponse } from '../../../shared/apiTypes';
import { deleteAuthed, postAuthed, putAuthed } from './utils';
import { ENDPOINTS_SOCIAL } from './endpoints';

export interface ISocialService {
    deleteForCurrentUser(id: string): Promise<Social | null>;
    createForCurrentUser(bodyObj: CreateSocialBody): Promise<Social | null>;
    updateForCurrentUser(id: string, bodyObj: UpdateSocialBody): Promise<Social | null>;
}


const SocialService = (getToken: () => Promise<string>): ISocialService => ({
    deleteForCurrentUser: async (id) => {
        const token = await getToken();
        const result = await deleteAuthed<DeleteSocialRespone>(ENDPOINTS_SOCIAL.DELETE(id), token);
        return result;
    },
    createForCurrentUser: async (bodyObj) => {
        const token = await getToken();
        const result = await postAuthed<CreateSocialResponse>(ENDPOINTS_SOCIAL.CREATE, token, bodyObj);
        return result;
    },
    updateForCurrentUser: async (id, bodyObj) => {
        const token = await getToken();
        const result = await putAuthed<UpdateSocialResponse>(ENDPOINTS_SOCIAL.UPDATE(id), token, bodyObj);
        return result;
    }
});

export const useSocialService = (): ISocialService => {
    const { getToken } = useAuth();
    
    const getTokenOrThrow = async () => {
        const token = await getToken();
        if (!token) throw new Error('Unable to fetch Clerk token.');
        return token;
    }

    const askService = SocialService(getTokenOrThrow);
    return askService;
}