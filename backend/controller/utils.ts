import { Request, Response } from "express";
import { UserSummary } from "../../shared/types";

export const getUserIdOrError = (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(501).end();
        const error = `Unauthorized user with Authorization: ${req.header('Authorization')}`;
        console.log(error);
        return { userId: '', error};
    }
    return {userId: req.user.id, error: null}
}