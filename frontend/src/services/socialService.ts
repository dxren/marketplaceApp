import { useAuth } from '@clerk/clerk-react'
import { Social } from '../../../shared/apiTypes';
import { CreateSocialResponseSchema, type CreateSocialBody } from '../../../shared/apiTypes';
import { deleteAuthed, postAuthed } from './utils';
import { ENDPOINTS_SOCIAL } from './endpoints';

export interface ISocialService {
    deleteForCurrentUser(id: string): Promise<Social | null>;
    createForCurrentUser(bodyObj: CreateSocialBody): Promise<Social | null>;
}


const SocialService = (getToken: () => Promise<string>): ISocialService => ({
    deleteForCurrentUser: async (id) => {
        const token = await getToken();
        const result = await deleteAuthed(ENDPOINTS_SOCIAL.DELETE(id), token);
        return result;
    },
    createForCurrentUser: async (bodyObj) => {
        const token = await getToken();
        const result = await postAuthed(ENDPOINTS_SOCIAL.CREATE, token, bodyObj, CreateSocialResponseSchema);
        return result;
    },
});

export const useSocialService = (): ISocialService => {
    const { getToken } = useAuth();
    
    const getTokenOrThrow = async () => {
        const token = await getToken();
        if (!token) throw new Error('Unable to fetch Clerk token.');
        return token;
    }

    const postService = SocialService(getTokenOrThrow);
    return postService;
}