import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

   

  },
  { timestamps: true }
);

export const image = mongoose.model("image", imageSchema)