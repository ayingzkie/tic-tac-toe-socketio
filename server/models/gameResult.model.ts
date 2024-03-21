import mongoose, { Schema } from "mongoose";

const GameResultSchema = new Schema({
  roomId: { type: String, required: true },
  winner: { type: String, required: true },
  loser: { type: String, required: true },
});

export default mongoose.model("GameResult", GameResultSchema);
