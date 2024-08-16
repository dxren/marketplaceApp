import { PriceOption } from "../../../shared/types";

export const handleCheckout = async (priceOption: PriceOption) => {
  //pass to the server the priceID and mode
  const url = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${url}/stripe/create-checkout-session`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      priceId: priceOption.priceId,
      mode: priceOption.mode,
    }),
  });
  console.log("server response: ", response);
};
