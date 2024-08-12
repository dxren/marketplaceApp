import { useAuth } from '@clerk/clerk-react'
import { Offer } from "../../../../shared/types";
import { offers, user } from '../../../../shared/examples';

export interface IOfferService {
    getAll(): Promise<Offer[]>;
    get(id: string): Promise<Offer | null>;
    create(description: string): Promise<Offer>;
    update(id: string, description: string): Promise<Offer>;
    delete(id: string): Promise<Offer>;
}

const OfferService = (getToken: () => Promise<string>): IOfferService => ({
    getAll: async () => {
        const token = await getToken();
        console.log(`Get all with token ${token}`);
        return offers;
    },
    get: async (id: string) => {
        const token = await getToken();
        console.log(`Get with token ${token}`);
        return offers.find(offer => offer.id === id) ?? null;
    },
    create: async (description: string) => {
        const token = await getToken();
        console.log(`Create with token ${token}`);
        const offer: Offer = {
            id: String(offers.length + 1),
            description,
            createdAt: new Date(),
            user
        }
        offers.push(offer);
        return offer;
    },
    update: async (id: string, description: string) => {
        const token = await getToken();
        console.log(`Update with token ${token}`);
        const toUpdateIndex = offers.findIndex(offer => offer.id === id);
        if (toUpdateIndex === -1) throw new Error(`Unable to find offer id ${id}.`);
        const updated: Offer = {...offers[toUpdateIndex], description};
        offers[toUpdateIndex] = updated;
        return offers[toUpdateIndex];
    },
    delete: async (id: string) => {
        const token = await getToken();
        console.log(`Delete with token ${token}`);
        const toDeleteIndex = offers.findIndex(offer => offer.id === id);
        if (toDeleteIndex === -1) throw new Error(`Unable to find offer id ${id}.`);
        const deleted = offers.splice(toDeleteIndex, 1)[0];
        return deleted;
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