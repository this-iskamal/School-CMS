import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

const recentNoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [imageSchema],
  },
  {
    timestamps: true,
  }
);

const RecentNotice = mongoose.model("RecentNotice", recentNoticeSchema);

module.exports = RecentNotice;
