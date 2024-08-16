//the service function handles the data that the controller receives
import Stripe from "stripe";
import { PriceOption } from "../../shared/types";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("could not load secret key");
}
const stripe = new Stripe(secretKey);

export interface IStripeService {
  createSession(
    url: string,
    selectedOption: PriceOption
  ): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}

export const StripeService = (): IStripeService => ({
  createSession: async (url: string, selectedOption: PriceOption) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: selectedOption.priceId,
          quantity: 1,
        },
      ],
      mode: selectedOption.mode,
      success_url: `${url}?success=true`,
      cancel_url: `${url}?canceled=true`,
    });
    return session;
  },
});
