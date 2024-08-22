import { create } from "zustand";
import { Ask, Offer, User } from "../../shared/types";

export interface IAppStore {
    asks: Ask[];
    offers: Offer[];
    currentUser: User | null;
    fetchedUser: User | null;
    askCount: number;
    offerCount: number;
    setAsks(asks: Ask[]): void;
    setOffers(offers: Offer[]): void;
    setCurrentUser(user: User | null): void;
    setCount(counts: {asks?: number, offers?: number}): void;
    setFetchedUser(fetchedUser: User | null): void;
}

export const useAppStore = create<IAppStore>((set) => ({
    asks: [],
    offers: [],
    currentUser: null,
    askCount: 0,
    offerCount: 0,
    fetchedUser: null,
    setAsks: (asks) => set({asks}),
    setOffers: (offers) => set({offers}),
    setCurrentUser: (currentUser) => set({currentUser}),
    setCount: (counts) => {
        if (counts.asks) set({askCount: counts.asks});
        if (counts.offers) set({offerCount: counts.offers});
    },
    setFetchedUser: (fetchedUser) => set({fetchedUser})
}));