import { Router } from "express";
import { getUserIdOrError } from "./utils";
import { UserService } from "../service/user";
import { GetUserResponse, UpdateUserBody } from "../../shared/apiTypes";
import { UpdateUserParams } from "../types";

export const userRouter = Router();

// GET
userRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result: GetUserResponse | null = await UserService().get(id);
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
  const result: GetUserResponse | null = await UserService().get(userId);
  if (!result) {
    res.status(404).end();
    return;
  }
  res.json(result);
});
