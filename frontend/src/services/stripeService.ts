import { PriceOption } from "../../../shared/types";
import { postRequest } from "./utils";

export const handleCheckout = async (priceOption: PriceOption) => {
  //pass to the server the priceID and mode
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!serverUrl) throw new Error('Unable to load server URL.');
  const url = `${serverUrl}/stripe/create-checkout-session`;
  const bodyObj = {
    priceId: priceOption.priceId,
    mode: priceOption.mode,
  };
  await postRequest(url, bodyObj);
};
