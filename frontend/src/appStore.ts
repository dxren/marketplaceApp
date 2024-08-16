import { create } from "zustand";
import { Ask, Offer, User, UserSummary } from "../../shared/types";

export interface IAppStore {
    asks: Ask[];
    offers: Offer[];
    setAsks(asks: Ask[]): void;
    appendAsk(ask: Ask): void;
    setOffers(offers: Offer[]): void;

}

export const useAppStore = create<IAppStore>((set) => ({
    asks: [],
    offers: [],
    setAsks: (asks) => set({asks}),
    appendAsk: (ask) => set(state => ({asks: [...state.asks, ask]})),
    setOffers: (offers) => set({offers}),
}));