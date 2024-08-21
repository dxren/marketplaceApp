import { Ask, Offer, User, UserSummary } from "./types";

export const user: UserSummary = {
    id: 'abc',
    avatarUrl: null,
    displayName: 'Person'
};

export const users: User[] = [
    {...user, avatarUrl: null, biography: 'I am a person', createdAt: new Date('2024-08-03-T12:00:00Z'), socials: [], asks: [], offers: [], favoriteAsks: [], favoriteOffers: []}
];

export const asks: Ask[] = [
    {
        id: '1',
        title: 'JavaScript Developer Needed',
        description: 'Looking for a JavaScript developer.',
        createdAt: new Date('2024-08-01T10:00:00Z'),
        user: user
    },
    {
        id: '2',
        title: 'Python Tutoring Services',
        description: 'Offering tutoring services in Python.',
        createdAt: new Date('2024-08-02T14:30:00Z'),
        user: user
    },
    {
        id: '3',
        title: 'Linux Server Setup Assistance',
        description: 'Need help with setting up a Linux server.',
        createdAt: new Date('2024-08-03T09:15:00Z'),
        user: user
    },
    {
        id: '4',
        title: 'Selling Used Laptop',
        description: 'Selling a gently used laptop.',
        createdAt: new Date('2024-08-04T16:45:00Z'),
        user: user
    },
    {
        id: '5',
        title: 'Graphic Designer Needed',
        description: 'Looking for a graphic designer for a small project.',
        createdAt: new Date('2024-08-05T12:20:00Z'),
        user: user
    }
];

export const offers: Offer[] = [
    {
        id: '1',
        title: 'JavaScript Developer Needed',
        description: 'Looking for a JavaScript developer.',
        createdAt: new Date('2024-08-01T10:00:00Z'),
        user: user
    },
    {
        id: '2',
        title: 'Python Tutoring Services',
        description: 'Offering tutoring services in Python.',
        createdAt: new Date('2024-08-02T14:30:00Z'),
        user: user
    },
    {
        id: '3',
        title: 'Linux Server Setup Assistance',
        description: 'Need help with setting up a Linux server.',
        createdAt: new Date('2024-08-03T09:15:00Z'),
        user: user
    },
    {
        id: '4',
        title: 'Selling Used Laptop',
        description: 'Selling a gently used laptop.',
        createdAt: new Date('2024-08-04T16:45:00Z'),
        user: user
    },
    {
        id: '5',
        title: 'Graphic Designer Needed',
        description: 'Looking for a graphic designer for a small project.',
        createdAt: new Date('2024-08-05T12:20:00Z'),
        user: user
    }
];
