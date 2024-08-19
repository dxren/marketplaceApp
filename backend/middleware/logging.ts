import { RequestHandler } from "express";

export const logging: () => RequestHandler = () => (req, _, next) => {
    console.log(`Received request: ${req.method} ${req.path}`);
    if (req.body) console.dir(req.body, {depth: null});
    return next();
}