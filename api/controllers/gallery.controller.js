import fs from "fs";
import multer from "multer";
import path from "path";
import { errorHandler } from "../utlis/error.js";
import Gallery from "../models/gallery.models.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "api/uploads/gallery");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });

  export const addNewGallery = [
    upload.array("images"),
    async (req, res, next) => {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to add gallery"));
      }
      if (!req.body.description) {
        return next(errorHandler(400, "Please provide all the fields"));
      }
  
      const imagePaths = req.files.map((file) => file.path);
  
      const newGallery = new Gallery({
        description: req.body.description,
        slug: req.body.slug,
        images: imagePaths,
      });
  
      try {
        const savedGallery = await newGallery.save();
        res.status(201).json(savedGallery);
      } catch (error) {
        next(error);
      }
    },
  ];


  export const getGallery = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === "asc" ? 1 : -1;
      const gallery = await Gallery.find({
        ...(req.query.galleryId && { _id: req.query.galleryId }),
        ...(req.query.searchTerm && {
          $or: [{ description: { $regex: req.query.searchTerm, $options: "i" } }],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalGallery = await Gallery.countDocuments();
      res.status(200).json({
        gallery,
        totalGallery,
      });
    } catch (error) {
      next(error);
    }
  };


  export const deleteGallery = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(
        errorHandler(403, "You are not allowed to delete this gallery")
      );
    }
  
    try {
      const gallery = await Gallery.findById(req.params.galleryId);
      if (!gallery) {
        return next(errorHandler(404, "gallery not found"));
      }
  
      const images = gallery.images;
  
      await Gallery.findByIdAndDelete(req.params.galleryId);
  
      images.forEach((imagePath) => {
        const fullPath = path.resolve(imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete image at ${fullPath}: ${err}`);
          }
        });
      });
  
      res.status(200).json("gallery has been deleted");
    } catch (error) {
      next(error);
    }
  };



  export const updateGallery = [
    upload.array("images"),
    async (req, res, next) => {
      if (!req.user.isAdmin) {
        return next(
          errorHandler(403, "You are not allowed to update this gallery")
        );
      }
      if (!req.body.description) {
        return next(errorHandler(400, "Please provide all the fields"));
      }
  
      try {
        const gallery = await Gallery.findById(req.params.galleryId);
        if (!gallery) {
          return next(errorHandler(404, "Gallery not found"));
        }
  
        const newImagePaths = req.files.map((file) => file.path);
        const imageUrls = JSON.parse(req.body.imageUrls);
        const existingImages = gallery.images;
  
        const updatedImages = [...imageUrls, ...newImagePaths];
  
        gallery.description = req.body.description;
        gallery.slug = req.body.slug;
        gallery.images = updatedImages;
  
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
  
        const updatedGallery = await gallery.save();
        res.status(200).json(updatedGallery);
      } catch (error) {
        next(error);
      }
    },
  ];