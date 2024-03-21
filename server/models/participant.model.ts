import mongoose, { Schema } from "mongoose";

const participantSchema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model("Participant", participantSchema);
