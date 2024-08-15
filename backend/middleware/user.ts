import { Handler } from "express";
import { prismaClient } from "../prismaClient";
import { clerkClient } from "../clerkClient";


export const createUserFromAuth: () => Handler = () => async (req, res, next) => {
    const id = req.auth?.userId;
    if (!id) {
        req.user = null;
        return next();
    }

    const clerkUser = await clerkClient.users.getUser(id);

    const email = clerkUser.primaryEmailAddress?.emailAddress;
    if (!email) {
        req.user = null;
        return next();
    }

    const displayName = clerkUser.fullName ?? 'New User';

    const user = await prismaClient.user.upsert({
        where: {id},
        update: {},
        create: {
            id,
            email,
            displayName
        }
    });

    req.user = user;
    return next();
}