import express, { json } from "express";
import cors from "cors";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { createUserFromAuth } from "./middleware/user";
import { askRouter } from "./controller/ask";
import { offerRouter } from "./controller/offer";
import { logging } from "./middleware/logging";
import { userRouter } from "./controller/user";
import { stripeRouter } from "./controller/stripe";

const PORT = 8080;

const app = express();
const stripe = require("stripe")(
  "sk_test_51PlZ5hRuUoTtZGvSNboFUZ7E6yB6pOYB1gEba655bHLB98zTrJYg16pTkhNynGCcsxeSSdhhwHVhct3QBtmAosRq00z2Fb66cy"
);

app.use(logging());
app.use(json());
app.use(cors());
app.use(ClerkExpressWithAuth());
app.use(createUserFromAuth());
app.use(express.static("public"));

app.get("/", (req, res) => res.end("Index"));

app.use("/ask", askRouter);
app.use("/offer", offerRouter);
app.use("/user", userRouter);
app.use("/stripe", stripeRouter);

app.listen(PORT, () => console.log(`Console listening on port ${PORT}.`));
