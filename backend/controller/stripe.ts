//controller is here to ensure that the user is authed, data type is in correct shape
//bouncer at a bar
import { Router } from "express";
import { StripeService } from "../service/stripe";
import { CreateCheckoutSessionBody } from "../../shared/apiTypes";

export const stripeRouter = Router();

stripeRouter.post("/create-checkout-session", async (req, res) => {
  const url = req.header("Origin") ?? "localhost:5173";
  const body = req.body as CreateCheckoutSessionBody;
  const selectedOption = body;
  const session = await StripeService().createSession(url, selectedOption);
  if (!session.url) {
    res.status(500).end("Error establishing a Stripe session.");
    return;
  }
  res.redirect(303, session.url);
});
