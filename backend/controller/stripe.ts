//controller is here to ensure that the user is authed, data type is in correct shape
//bouncer at a bar
import { Router } from "express";
import { StripeService } from "../service/stripe";

export const stripeRouter = Router();

stripeRouter.post("/create-checkout-session", async (_req, res) => {
  const session = await StripeService().createSession();
  res.redirect(303, session.url);
});
