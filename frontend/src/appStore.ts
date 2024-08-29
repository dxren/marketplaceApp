import { create } from "zustand";
import { Post, User } from "../../shared/apiTypes";

export interface IAppStore {
    posts: Post[];
    favoritePosts: Post[];
    currentUser: User | null;
    fetchedUsers: User[];
    postCount: number;
    favoritePostCount: number;
    setPosts(posts: Post[]): void;
    setFavoritePosts(favoritePosts: Post[]): void;
    setCurrentUser(user: User | null): void;
    setFetchedUsers(fetchedUsers: User[]): void;
    setCount(counts: {posts?: number, favoritePosts?: number}): void;
}

export const useAppStore = create<IAppStore>((set) => ({
    posts: [],
    favoritePosts: [],
    currentUser: null,
    fetchedUsers: [],
    postCount: 0,
    favoritePostCount: 0,
    fetchedUser: null,
    setPosts: (posts) => set({posts}),
    setFavoritePosts: (favoritePosts) => set({favoritePosts}),
    setCurrentUser: (currentUser) => set({currentUser}),
    setCount: (counts) => {
        if (counts.posts !== undefined) set({postCount: counts.posts});
        if (counts.favoritePosts !== undefined) set({favoritePostCount: counts.favoritePosts});
    },
    setFetchedUsers: (fetchedUsers) => set({fetchedUsers})
}));