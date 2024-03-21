import { Request, Response } from "express";
import GameResultModel from "../../models/GameResult.model";

export default async (req: Request, res: Response) => {
  try {
    await GameResultModel.create({
      roomId: 123,
      winner: "John",
      loser: "Nikko",
    });
    return res.status(200).json({
      message: "Successfully saved!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong! Please contact admin",
    });
  }
};
