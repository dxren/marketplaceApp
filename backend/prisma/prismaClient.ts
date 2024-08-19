import { Prisma, PrismaClient } from '@prisma/client';

const getDatesAsStrings = Prisma.defineExtension(client => client.$extends({
    model: {
        $allModels: {
            $allFields: {
                transform: ({ result }: { result: any }) => {
                    if (result instanceof Date) return result.toUTCString()
                }
            }
        }
    }
}));

export const prismaClient = new PrismaClient().$extends(getDatesAsStrings);