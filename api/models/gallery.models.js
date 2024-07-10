import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: [imageSchema],
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
