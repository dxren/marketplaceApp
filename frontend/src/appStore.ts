import { create } from "zustand";
import { Post, Offer, User } from "../../shared/types";

export interface IAppStore {
    posts: Post[];
    offers: Offer[];
    favoritePosts: Post[];
    favoriteOffers: Offer[];
    currentUser: User | null;
    fetchedUser: User | null;
    postCount: number;
    offerCount: number;
    favoritePostCount: number;
    favoriteOfferCount: number;
    setPosts(posts: Post[]): void;
    setOffers(offers: Offer[]): void;
    setFavoritePosts(favoritePosts: Post[]): void;
    setFavoriteOffers(favoriteOffers: Offer[]): void;
    setCurrentUser(user: User | null): void;
    setCount(counts: {posts?: number, offers?: number, favoritePosts?: number, favoriteOffers?: number}): void;
    setFetchedUser(fetchedUser: User | null): void;
}

export const useAppStore = create<IAppStore>((set) => ({
    posts: [],
    offers: [],
    favoritePosts: [],
    favoriteOffers: [],
    currentUser: null,
    postCount: 0,
    offerCount: 0,
    favoritePostCount: 0,
    favoriteOfferCount: 0,
    fetchedUser: null,
    setPosts: (posts) => set({posts}),
    setOffers: (offers) => set({offers}),
    setFavoritePosts: (favoritePosts) => set({favoritePosts}),
    setFavoriteOffers: (favoriteOffers) => set({favoriteOffers}),
    setCurrentUser: (currentUser) => set({currentUser}),
    setCount: (counts) => {
        if (counts.posts !== undefined) set({postCount: counts.posts});
        if (counts.offers !== undefined) set({offerCount: counts.offers});
        if (counts.favoritePosts !== undefined) set({favoritePostCount: counts.favoritePosts});
        if (counts.favoriteOffers !== undefined) set({favoriteOfferCount: counts.favoriteOffers});
    },
    setFetchedUser: (fetchedUser) => set({fetchedUser})
}));