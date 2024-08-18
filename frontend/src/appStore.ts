import { create } from "zustand";
import { Ask, Offer, User } from "../../shared/types";

export interface IAppStore {
    asks: Ask[];
    offers: Offer[];
    currentUser: User | null;
    setAsks(asks: Ask[]): void;
    setOffers(offers: Offer[]): void;
    setCurrentUser(user: User | null): void;
}

export const useAppStore = create<IAppStore>((set) => ({
    asks: [],
    offers: [],
    currentUser: null,
    setAsks: (asks) => set({asks}),
    setOffers: (offers) => set({offers}),
    setCurrentUser: (user) => set({currentUser: user})
}));