import { useAuth } from '@clerk/clerk-react'
import { Offer } from "../../../../shared/types";
// import { offers, user } from '../../../../shared/examples';
import { deleteAuthed, getAuthed, postAuthed, putAuthed } from '../utils';
import { ENDPOINTS_OFFER } from '../../endpoints';
import { CreateOfferBody, CreateOfferResponse, DeleteOfferResponse, GetManyOfferResponse, GetOneOfferResponse, UpdateOfferBody, UpdateOfferResponse } from '../../../../shared/apiTypes';

export interface IOfferService {
    getAllByCurrentUser(): Promise<Offer[] | null>;
    getAllByUser(id: string): Promise<Offer[] | null>; 
    getOne(id: string): Promise<Offer | null>;
    create(description: string): Promise<Offer | null>;
    update(id: string, description: string): Promise<Offer | null>;
    delete(id: string): Promise<Offer | null>;
    getAll(): Promise<Offer[] | null>;
}


const OfferService = (getToken: () => Promise<string>): IOfferService => ({
    getAllByCurrentUser: async () => {
        const url = ENDPOINTS_OFFER.GET_ALL_BY_CURRENT_USER;
        const token = await getToken();
        const offers = await getAuthed<GetManyOfferResponse>(url, token);
        return offers;
        // console.log(`Get all with token ${token}`);
        // return offers;
    },
    getAllByUser: async (id: string) => {
        const url = ENDPOINTS_OFFER.GET_ALL_BY_USER(id);
        const token = await getToken();
        const offers = await getAuthed<GetManyOfferResponse>(url, token);
        return offers;
        // console.log(`Get all with token ${token}`);
        // return offers;
    },
    getOne: async (id: string) => {
        const url = ENDPOINTS_OFFER.GET_ONE(id);
        const token = await getToken();
        const offer = await getAuthed<GetOneOfferResponse>(url, token);
        return offer;
        // console.log(`Get with token ${token}`);
        // return offers.find(offer => offer.id === id) ?? null;
    },
    create: async (description: string) => {
        const url = ENDPOINTS_OFFER.CREATE;
        const token = await getToken();
        const bodyObj: CreateOfferBody = { description };
        const offer = await postAuthed<CreateOfferResponse>(url, token, bodyObj);
        return offer;
        // console.log(`Create with token ${token}`);
        // const offer: Offer = {
        //     id: String(offers.length + 1),
        //     description,
        //     createdAt: new Date(),
        //     user
        // }
        // offers.push(offer);
        // return offer;
    },
    update: async (id: string, description: string) => {
        const url = ENDPOINTS_OFFER.UPDATE(id);
        const token = await getToken();
        const bodyObj: UpdateOfferBody = { description };
        const offer = await putAuthed<UpdateOfferResponse>(url, token, bodyObj);
        return offer;
        // console.log(`Update with token ${token}`);
        // const toUpdateIndex = offers.findIndex(offer => offer.id === id);
        // if (toUpdateIndex === -1) throw new Error(`Unable to find offer id ${id}.`);
        // const updated: Offer = {...offers[toUpdateIndex], description};
        // offers[toUpdateIndex] = updated;
        // return offers[toUpdateIndex];
    },
    delete: async (id: string) => {
        const url = ENDPOINTS_OFFER.DELETE(id);
        const token = await getToken();
        const offer = await deleteAuthed<DeleteOfferResponse>(url, token);
        return offer;
        // console.log(`Delete with token ${token}`);
        // const toDeleteIndex = offers.findIndex(offer => offer.id === id);
        // if (toDeleteIndex === -1) throw new Error(`Unable to find offer id ${id}.`);
        // const deleted = offers.splice(toDeleteIndex, 1)[0];
        // return deleted;
    },
    getAll: async () => {
        const url = ENDPOINTS_OFFER.GET_ALL;
        const token = await getToken();
        const offers = await getAuthed<GetManyOfferResponse>(url, token);
        return offers;
        // console.log(`Get all with token ${token}`);
        // return offers;
    }
})

export const useOfferService = (): IOfferService => {
    const { getToken } = useAuth();
    
    const getTokenOrThrow = async () => {
        const token = await getToken();
        if (!token) throw new Error('Unable to fetch Clerk token.');
        return token;
    }

    const offerService = OfferService(getTokenOrThrow);
    return offerService;
}