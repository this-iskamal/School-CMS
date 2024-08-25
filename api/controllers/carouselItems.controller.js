import fs from "fs";
import multer from "multer";
import path from "path";
import { errorHandler } from "../utlis/error.js";
import CarouselItems from "../models/carouselItems.models.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "api/uploads/carousel");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

  export const addNewCarousel = [
    upload.array("images"),
    async (req, res, next) => {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to add carousel"));
      }
      if (!req.body.description) {
        return next(errorHandler(400, "Please provide all the fields"));
      }
  
      const imagePaths = req.files.map((file) => file.path);
  
      const newCarousel = new CarouselItems({
        description: req.body.description,
        images: imagePaths,
      });
  
      try {
        const savedCarousel = await newCarousel.save();
        res.status(201).json(savedCarousel);
      } catch (error) {
        next(error);
      }
    },
  ];

  export const getCarousels = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === "asc" ? 1 : -1;
      const carousel = await CarouselItems.find({
        ...(req.query.carouselId && { _id: req.query.carouselId }),
        ...(req.query.searchTerm && {
          $or: [
            { description: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalCarousel = await CarouselItems.countDocuments();
      res.status(200).json({
        carousel,
        totalCarousel,
      });
    } catch (error) {
      next(error);
    }
  };

  export const deleteCarousels = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to delete this carousel"));
    }
  
    try {
      const carousel = await CarouselItems.findById(req.params.carouselId);
      if (!carousel) {
        return next(errorHandler(404, "Carousel not found"));
      }
  
      const images = carousel.images;
  
      await CarouselItems.findByIdAndDelete(req.params.carouselId);
  
      images.forEach((imagePath) => {
        const fullPath = path.resolve(imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete image at ${fullPath}: ${err}`);
          }
        });
      });
  
      res.status(200).json("Carousel has been deleted");
    } catch (error) {
      next(error);
    }
  };

  export const updateCarousel = [
    upload.array('images'),
    async (req, res, next) => {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to update this carousel'));
      }
      if (!req.body.description) {
        return next(errorHandler(400, 'Please provide all the fields'));
      }
  
      try {
        const carousel = await CarouselItems.findById(req.params.carouselId);
        if (!carousel) {
          return next(errorHandler(404, 'Carousel not found'));
        }
  
        const newImagePaths = req.files.map((file) => file.path);
        const imageUrls = JSON.parse(req.body.imageUrls); 
        const existingImages = carousel.images;
  
  
        const updatedImages = [...imageUrls, ...newImagePaths];
  
        
        carousel.description = req.body.decription;
        carousel.images = updatedImages;
  
  
        const imagesToDelete = existingImages.filter(
          (imagePath) => !imageUrls.includes(imagePath)
        );
  
  
        imagesToDelete.forEach((imagePath) => {
          const fullPath = path.resolve(imagePath);
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error(`Failed to delete image at ${fullPath}: ${err}`);
            }
          });
        });
  
        const updatedCarousel = await carousel.save();
        res.status(200).json(updatedCarousel);
      } catch (error) {
        next(error);
      }
    },
  ];