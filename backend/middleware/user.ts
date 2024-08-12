import e, { Handler } from "express";
import { prismaClient } from "../prismaClient";
import { clerkClient } from "../clerkClient";


export const User: () => Handler = () => async (req, res, next) => {
    const id = req.auth?.userId;
    if (!id) {
        req.user = null;
        next();
        return;
    }

    const clerkUser = await clerkClient.users.getUser(id);

    const email = clerkUser.primaryEmailAddress?.emailAddress;
    if (!email) {
        req.user = null;
        next();
        return;
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
    next();
}