import { Router } from "express";
import { getUserIdOrError, parseGetManyOptions } from "./utils";
import { UserService } from "../service/user";
import { GetUserResponseSchema, UpdateUserBody, UpdateUserBodySchema, UpdateUserResponseSchema } from "../../shared/apiTypes";
import { UpdateUserParams } from "../types";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { createUserFromAuth } from "../middleware/user";
import { validateRequestBody } from "zod-express-middleware";

export const userRouter = Router();

userRouter.use(ClerkExpressWithAuth(), createUserFromAuth());

// GET
userRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const foundUser = await UserService().get(id);
  if (!foundUser) {
    res.status(404).end();
    return;
  }
  const result = GetUserResponseSchema.parse(foundUser);
  res.json(result);
});

// UPDATE_CURRENT
userRouter.put("/", validateRequestBody(UpdateUserBodySchema), async (req, res) => {
    const { userId, error } = getUserIdOrError(req, res);
    if (error) return;
    const body = req.body;
    const data: UpdateUserParams = {
        displayName: body.displayName,
        avatarUrl: body.avatarUrl,
        biography: body.biography,
        socials: body.socials,
    };
    const result = UpdateUserResponseSchema.parse(await UserService().update(userId, data));
    res.json(result);
});

// GET_CURRENT
userRouter.get("/", async (req, res) => {
    if (!req.user) {
        res.status(401).end();
        return;
    }
    const result = GetUserResponseSchema.parse(req.user);
    res.json(result);
});