import express, { json } from "express";
import cors from "cors";
import { askRouter } from "./controller/ask";
import { offerRouter } from "./controller/offer";
import { logging } from "./middleware/logging";
import { userRouter } from "./controller/user";
import { socialRouter } from "./controller/social";
import { stripeRouter } from "./controller/stripe";

const PORT = process.env.PORT ?? 8080;

const app = express();

app.use(logging());
app.use(json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => res.end("Index"));

app.use("/ask", askRouter);
app.use("/offer", offerRouter);
app.use("/user", userRouter);
app.use("/social", socialRouter);
app.use("/stripe", stripeRouter);

app.listen(PORT, () => console.log(`Console listening on port ${PORT}.`));
