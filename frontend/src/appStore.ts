import { create } from "zustand";
import { Ask, AskOfferComment, Offer, User } from "../../shared/types";

export interface IAppStore {
  asks: Ask[];
  offers: Offer[];
  favoriteAsks: Ask[];
  favoriteOffers: Offer[];
  comments: AskOfferComment[];
  currentUser: User | null;
  fetchedUser: User | null;
  askCount: number;
  offerCount: number;
  favoriteAskCount: number;
  favoriteOfferCount: number;
  commentCount: number;
  setAsks(asks: Ask[]): void;
  setOffers(offers: Offer[]): void;
  setFavoriteAsks(favoriteAsks: Ask[]): void;
  setFavoriteOffers(favoriteOffers: Offer[]): void;
  setComments(comments: AskOfferComment[]): void;
  setCurrentUser(user: User | null): void;
  setCount(counts: {
    asks?: number;
    offers?: number;
    favoriteAsks?: number;
    favoriteOffers?: number;
    comments?: number;
  }): void;
  setFetchedUser(fetchedUser: User | null): void;
}

export const useAppStore = create<IAppStore>((set) => ({
  asks: [],
  offers: [],
  favoriteAsks: [],
  favoriteOffers: [],
  comments: [],
  currentUser: null,
  askCount: 0,
  offerCount: 0,
  favoriteAskCount: 0,
  favoriteOfferCount: 0,
  commentCount: 0,
  fetchedUser: null,
  setAsks: (asks) => set({ asks }),
  setOffers: (offers) => set({ offers }),
  setFavoriteAsks: (favoriteAsks) => set({ favoriteAsks }),
  setFavoriteOffers: (favoriteOffers) => set({ favoriteOffers }),
  setComments: (comments) => set({ comments }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setCount: (counts) => {
    if (counts.asks !== undefined) set({ askCount: counts.asks });
    if (counts.offers !== undefined) set({ offerCount: counts.offers });
    if (counts.favoriteAsks !== undefined)
      set({ favoriteAskCount: counts.favoriteAsks });
    if (counts.favoriteOffers !== undefined)
      set({ favoriteOfferCount: counts.favoriteOffers });
    if (counts.comments !== undefined) set({ commentCount: counts.comments });
  },
  setFetchedUser: (fetchedUser) => set({ fetchedUser }),
}));
