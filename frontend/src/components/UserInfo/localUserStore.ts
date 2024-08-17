import { create } from "zustand";
import { User } from "../../../../shared/types";

type LocalUser = Omit<User, 'id'>;
export type LocalUserStore = {
    localUser: LocalUser | null,
    setLocalUser(user: LocalUser | User | null): void;
}
export const useLocalUserStore = create<LocalUserStore>(set => ({
    localUser: null,
    setLocalUser: (user) => set({localUser: user ? {...user} : null})
}));