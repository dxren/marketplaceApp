import { Ask, Offer } from "./types";

export const user = {
    id: 'abc',
    displayName: 'Person'
};

export const asks: Ask[] = [
    {
        id: '1',
        description: 'Looking for a JavaScript developer.',
        createdAt: new Date('2024-08-01T10:00:00Z'),
        user: user
    },
    {
        id: '2',
        description: 'Offering tutoring services in Python.',
        createdAt: new Date('2024-08-02T14:30:00Z'),
        user: user
    },
    {
        id: '3',
        description: 'Need help with setting up a Linux server.',
        createdAt: new Date('2024-08-03T09:15:00Z'),
        user: user
    },
    {
        id: '4',
        description: 'Selling a gently used laptop.',
        createdAt: new Date('2024-08-04T16:45:00Z'),
        user: user
    },
    {
        id: '5',
        description: 'Looking for a graphic designer for a small project.',
        createdAt: new Date('2024-08-05T12:20:00Z'),
        user: user
    }
];

export const offers: Offer[] = [
    {
        id: '1',
        description: 'Looking for a JavaScript developer.',
        createdAt: new Date('2024-08-01T10:00:00Z'),
        user: user
    },
    {
        id: '2',
        description: 'Offering tutoring services in Python.',
        createdAt: new Date('2024-08-02T14:30:00Z'),
        user: user
    },
    {
        id: '3',
        description: 'Need help with setting up a Linux server.',
        createdAt: new Date('2024-08-03T09:15:00Z'),
        user: user
    },
    {
        id: '4',
        description: 'Selling a gently used laptop.',
        createdAt: new Date('2024-08-04T16:45:00Z'),
        user: user
    },
    {
        id: '5',
        description: 'Looking for a graphic designer for a small project.',
        createdAt: new Date('2024-08-05T12:20:00Z'),
        user: user
    }
];