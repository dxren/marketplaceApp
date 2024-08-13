export type UserSummary = {
    id: string;
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
    description: string;
    createdAt: Date;
    user: UserSummary;
};

export type Offer = {
    id: string;
    description: string;
    createdAt: Date;
    user: UserSummary;
};

export type User = {
    id: string;
    displayName: string;
    socials: Social[];
    asks: Ask[];
    offers: Offer[];
};