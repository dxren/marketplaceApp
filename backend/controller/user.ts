import { Router } from "express";
import { getUserIdOrError } from "./utils";
import { UserService } from "../service/user";
import { GetUserResponse, UpdateUserBody } from "../../shared/apiTypes";
import { UpdateUserParams } from "../types";

const userRouter = Router();

userRouter.get('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const result: GetUserResponse | null = await UserService().get(userId);
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

userRouter.put('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    if (id !== userId) {
        res.status(401).end();
        return;
    }
    const body = req.body as UpdateUserBody;
    const data: UpdateUserParams = {
        displayName: body.displayName,
        asks: body.asks,
        offers: body.offers,
        socials: body.socials
    };
    const result = await UserService().update(id, data);
    res.json(result);
})