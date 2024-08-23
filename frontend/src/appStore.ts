import { create } from "zustand";
import { Ask, Offer, User } from "../../shared/types";

export interface IAppStore {
    asks: Ask[];
    offers: Offer[];
    favoriteAsks: Ask[];
    favoriteOffers: Offer[];
    currentUser: User | null;
    fetchedUser: User | null;
    askCount: number;
    offerCount: number;
    favoriteAskCount: number;
    favoriteOfferCount: number;
    setAsks(asks: Ask[]): void;
    setOffers(offers: Offer[]): void;
    setFavoriteAsks(favoriteAsks: Ask[]): void;
    setFavoriteOffers(favoriteOffers: Offer[]): void;
    setCurrentUser(user: User | null): void;
    setCount(counts: {asks?: number, offers?: number, favoriteAsks?: number, favoriteOffers?: number}): void;
    setFetchedUser(fetchedUser: User | null): void;
}

export const useAppStore = create<IAppStore>((set) => ({
    asks: [],
    offers: [],
    favoriteAsks: [],
    favoriteOffers: [],
    currentUser: null,
    askCount: 0,
    offerCount: 0,
    favoriteAskCount: 0,
    favoriteOfferCount: 0,
    fetchedUser: null,
    setAsks: (asks) => set({asks}),
    setOffers: (offers) => set({offers}),
    setFavoriteAsks: (favoriteAsks) => set({favoriteAsks}),
    setFavoriteOffers: (favoriteOffers) => set({favoriteOffers}),
    setCurrentUser: (currentUser) => set({currentUser}),
    setCount: (counts) => {
        if (counts.asks !== undefined) set({askCount: counts.asks});
        if (counts.offers !== undefined) set({offerCount: counts.offers});
        if (counts.favoriteAsks !== undefined) set({favoriteAskCount: counts.favoriteAsks});
        if (counts.favoriteOffers !== undefined) set({favoriteOfferCount: counts.favoriteOffers});
    },
    setFetchedUser: (fetchedUser) => set({fetchedUser})
}));