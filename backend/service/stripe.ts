//the service function handles the data that the controller receives
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51PlZ5hRuUoTtZGvSNboFUZ7E6yB6pOYB1gEba655bHLB98zTrJYg16pTkhNynGCcsxeSSdhhwHVhct3QBtmAosRq00z2Fb66cy"
);

// export interface IStripeService {
//   createSession(): Promise;
// }

interface PriceOption {
  priceId: string;
  mode: "payment" | "subscription";
}

export const StripeService = () => ({
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
