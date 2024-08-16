export type UserSummary = {
    id: string;
    avatarUrl: string | null;
    displayName: string;
};

export type Social = {
    id: string;
    name: string;
    value: string;
    user: UserSummary
};

export type Ask = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    user: UserSummary;
};

export type Offer = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    user: UserSummary;
};

export type User = {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    biography: string;
    createdAt: Date;
    socials: Social[];
    asks: Ask[];
    offers: Offer[];
};