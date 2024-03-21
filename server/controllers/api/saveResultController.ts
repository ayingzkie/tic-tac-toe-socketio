import { Request, Response } from "express";
import database from "../../config/database";

export default async (req: Request, res: Response) => {
  const gameResults = await database();
  return res.send("Hello");
};
