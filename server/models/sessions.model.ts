import mongoose, { Schema } from "mongoose";
import Participant from "./participant.model";

const SessionSchema = new Schema({
  roomId: { type: String, required: true },
  participants: { type: mongoose.Types, ref: "Participant" },
});

export default mongoose.model("Session", SessionSchema);
