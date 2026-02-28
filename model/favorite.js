import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "image",
      required: true
    }
  },
  { timestamps: true }
)

favoriteSchema.index({ user: 1, image: 1 }, { unique: true })

export const favorite = mongoose.model("favorite", favoriteSchema)