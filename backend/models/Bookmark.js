import mongoose, { Schema, model } from "mongoose";

const bookmarkSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
});

export const Bookmark = new model("Bookmark", bookmarkSchema);
