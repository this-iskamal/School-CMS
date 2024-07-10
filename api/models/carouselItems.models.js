import mongoose from "mongoose";

const carouselItemsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

const CarouselItems = mongoose.model("Carousel Items", carouselItemsSchema);

export default CarouselItems;