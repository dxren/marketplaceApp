export const PRISMA_SELECT_ASK = {
    id: true,
    description: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            displayName: true
        }
    }
};

export type Unchecked<T> = Partial<T>;