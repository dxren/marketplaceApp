import { Request, Response } from "express";
import { GetManyOptions } from "../../shared/apiTypes";

export const getUserIdOrError = (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    res.status(401).end();
    const error = `Unauthorized user with Authorization: ${req.header(
      "Authorization"
    )}`;
    console.log(error);
    return { userId: "", error };
  }
  return { userId: req.user.id, error: null };
};

export const parseGetManyOptions = (req: Request) => {
  const options: GetManyOptions = {
    limit: parseInt(req.query.limit as string) || undefined,
    offset: parseInt(req.query.offset as string) || undefined,
    searchString: req.query.searchString?.toString?.() || "",
  };
  return options;
};
