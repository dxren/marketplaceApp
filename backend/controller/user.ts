import { Router } from "express";
import { getUserIdOrError, parseGetManyOptions } from "./utils";
import { UserService } from "../service/user";
import { UpdateUserBody } from "../../shared/apiTypes";
import { UpdateUserParams } from "../types";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { createUserFromAuth } from "../middleware/user";
import { User } from "../../shared/types";
import { AskService } from "../service/ask";
import { OfferService } from "../service/offer";

export const userRouter = Router();

userRouter.use(ClerkExpressWithAuth(), createUserFromAuth());

// GET
userRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result: User | null = await UserService().get(id);
  if (!result) {
    res.status(404).end();
    return;
  }
  res.json(result);
});

// UPDATE_CURRENT
userRouter.put("/", async (req, res) => {
  const { userId, error } = getUserIdOrError(req, res);
  if (error) return;
  const body = req.body as UpdateUserBody;
  const data: UpdateUserParams = {
    displayName: body.displayName,
    avatarUrl: body.avatarUrl,
    biography: body.biography,
    asks: body.asks,
    offers: body.offers,
    socials: body.socials,
  };
  const result = await UserService().update(userId, data);
  res.json(result);
});

// GET_CURRENT
userRouter.get("/", async (req, res) => {
  const { userId, error } = getUserIdOrError(req, res);
  if (error) return;
  const result: User | null = await UserService().get(userId);
  if (!result) {
    res.status(404).end();
    return;
  }
  res.json(result);
});

// GET_FAVORITES
userRouter.get('/favorites/:id', async (req, res) => {
    const userId = req.params.id;
    const options = parseGetManyOptions(req);
    const [asks, offers] = await Promise.all([AskService().getFavoritedByUser(userId, options), OfferService().getFavoritedByUser(userId, options)]);
    const result = {asks, offers}
    res.json(result);
});