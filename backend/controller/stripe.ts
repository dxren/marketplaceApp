//controller is here to ensure that the user is authed, data type is in correct shape
//bouncer at a bar
import { Router } from "express";
import { StripeService } from "../service/stripe";
import { CreateCheckoutSessionBody } from "../../shared/apiTypes";
import { PRICE_OPTIONS } from "../../shared/constants";
import { PriceOption } from "../../shared/types";

export const stripeRouter = Router();

stripeRouter.post("/create-checkout-session/:mode", async (req, res) => {
  const url = req.header("Origin") ?? "localhost:5173";
  const mode = req.params.mode;
  if (mode !== "subscription" && mode !== "payment") {
    res.status(400).end();
    return;
  }
  const priceId = Object.values(PRICE_OPTIONS).find(
    (priceOptions) => priceOptions.mode === mode
  )?.priceId;
  if (!priceId) return res.status(400).end();
  const selectedOption: PriceOption = { priceId, mode };
  const session = await StripeService().createSession(url, selectedOption);
  if (!session.url) {
    res.status(500).end("Error establishing a Stripe session.");
    return;
  }
  res.redirect(303, session.url);
});
