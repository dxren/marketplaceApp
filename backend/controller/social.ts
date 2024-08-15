import { Router } from "express";
import { getUserIdOrError } from "./utils";
import { SocialService } from "../service/social";
import { CreateSocialParams, UpdateSocialParams } from "../types";
import { CreateSocialBody, CreateSocialResponse, UpdateSocialBody } from "../../shared/apiTypes";

export const socialRouter = Router();

// DELETE
socialRouter.delete('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    const social = await SocialService().get(id);
    if (!social) {
        res.status(404).end();
        return;
    } else if (userId !== social?.user.id) {
        res.status(401).end();
        return;
    }
    const result = await SocialService().delete(id);
    res.json(result);
})

// CREATE
socialRouter.post('/', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const body = req.body as CreateSocialBody;
    const { name, value } = body;
    const params: CreateSocialParams = { name, value, userId };
    const result: CreateSocialResponse = await SocialService().create(params);
    res.json(result);
});

// UPDATE
socialRouter.put('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    const toUpdate = await SocialService().get(id);
    if (!toUpdate) {
        res.status(404).end();
        return;
    } else if (toUpdate.user.id !== userId) {
        res.status(401).end();
        return;
    }
    const body = req.body as UpdateSocialBody;
    const { name, value } = body;
    const params: UpdateSocialParams = { name, value };
    const result = await SocialService().update(id, params);
    res.json(result);
})