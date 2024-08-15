//controller is here to ensure that the user is authed, data type is in correct shape
//bouncer at a bar
import { Router } from "express";
import { StripeService } from "../service/stripe";

export const stripeRouter = Router();

stripeRouter.post("/create-checkout-session", async (req, res) => {
  const url = req.header("Origin") ?? "localhost:5173";
  const session = await StripeService().createSession(url);
  if (!session.url) {
    res.status(500).end('Error establishing a Stripe session.');
    return;
  }
  res.redirect(303, session.url);
});
