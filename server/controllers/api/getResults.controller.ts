import { Request, Response } from "express";
import GameResultModel from "../../models/GameResult.model";

export default async (req: Request, res: Response) => {
  try {
    const result = await GameResultModel.aggregate([
      {
        $group: {
          _id: "$roomId",
          participants: { $push: "$$ROOT" },
        },
      },
    ]);

    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong! Please contact admin",
    });
  }
};
