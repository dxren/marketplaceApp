import { Router } from "express";
import { getUserIdOrError } from "./utils";
import { SocialService } from "../service/social";
import { CreateSocialBodySchema, DeleteSocialResponseSchema, CreateSocialResponseSchema } from "../../shared/apiTypes";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { createUserFromAuth } from "../middleware/user";
import { validateRequestBody } from "zod-express-middleware";

export const socialRouter = Router();

socialRouter.use(ClerkExpressWithAuth(), createUserFromAuth());

// DELETE
socialRouter.delete('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    const social = await SocialService().get(id);
    if (!social) {
        res.status(404).end();
        return;
    } else if (userId !== social?.userId) {
        res.status(401).end();
        return;
    }
    const result = DeleteSocialResponseSchema.parse(await SocialService().delete(id));
    res.json(result);
})

// CREATE
socialRouter.post('/', validateRequestBody(CreateSocialBodySchema), async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const data = {...req.body, userId};
    const result = CreateSocialResponseSchema.parse(await SocialService().create(data));
    res.json(result);
});

// UPDATE
// socialRouter.put('/:id', async (req, res) => {
//     const {userId, error} = getUserIdOrError(req, res);
//     if (error) return;
//     const id = req.params.id;
//     const toUpdate = await SocialService().get(id);
//     if (!toUpdate) {
//         res.status(404).end();
//         return;
//     } else if (toUpdate.user.id !== userId) {
//         res.status(401).end();
//         return;
//     }
//     const body = req.body as UpdateSocialBody;
//     const { name, value } = body;
//     const params: UpdateSocialParams = { name, value };
//     const result = await SocialService().update(id, params);
//     res.json(result);
// })