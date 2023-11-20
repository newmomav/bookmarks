import mongoose, { Schema, model } from "mongoose";

const groupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bookmark" }],
});

export const Group = mongoose.model("Group", groupSchema);
