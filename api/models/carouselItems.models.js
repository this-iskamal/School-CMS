import mongoose from "mongoose";

const carouselItemsSchema = new mongoose.Schema(
  {
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

const CarouselItems = mongoose.model("Carousel Items", carouselItemsSchema);

export default CarouselItems;