import mongoose from "mongoose";

export const testSchema = new mongoose.Schema({
  title: { type: String },
});

export const Test = mongoose.model("Test", testSchema);
