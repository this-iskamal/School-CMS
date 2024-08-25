import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
 
},
{ timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
