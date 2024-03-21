import mongoose, { Schema } from "mongoose";

const GameResultSchema = new Schema({
  roomId: { type: String, required: true },
  playerName: { type: String, required: true },
  winCount: { type: Number, required: true },
  loseCount: { type: Number, required: true },
  drawCount: { type: Number, required: true },
});

export default mongoose.model("GameResult", GameResultSchema);
