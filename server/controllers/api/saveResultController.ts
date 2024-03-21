import { Request, Response } from "express";
import GameResultModel from "../../models/GameResult.model";

export default async (req: Request, res: Response) => {
  await GameResultModel.create({
    roomId: 123,
    winner: "John",
    loser: "Nikko",
  });
  return res.send("Hello");
};
