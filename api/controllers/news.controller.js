import fs from "fs";
import multer from "multer";
import path from "path";
import { errorHandler } from "../utlis/error.js";
import News from "../models/news.models.js";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "api/uploads/news");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const upload = multer({ storage: storage });


export const addNewNews = [
    upload.array("images"),
    async (req, res, next) => {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to add news"));
      }
      if (!req.body.title || !req.body.slug || !req.body.content) {
        return next(errorHandler(400, "Please provide all the fields"));
      }
  
      const imagePaths = req.files.map((file) => file.path);
  
      const newNews = new News({
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        author:req.body.author,
        images: imagePaths,
      });
  
      try {
        const savedNews = await newNews.save();
        res.status(201).json(savedNews);
      } catch (error) {
        next(error);
      }
    },
  ];


  export const getNews = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === "asc" ? 1 : -1;
      const news = await News.find({
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.author && { author: req.query.author }),
        ...(req.query.newsId && { _id: req.query.newsId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: "i" } },
            { content: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalnews = await News.countDocuments();
      res.status(200).json({
        news,
        totalnews,
      });
    } catch (error) {
      next(error);
    }
  };

  export const deletenews = async (req, res, next) => {

    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to delete this news"));
    }
  
    try {
      
      const news = await News.findById(req.params.newsId);
      if (!news) {
        return next(errorHandler(404, "News not found"));
      }
  
      const images = news.images;
  
      await News.findByIdAndDelete(req.params.newsId);
  
      images.forEach((imagePath) => {
        const fullPath = path.resolve(imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete image at ${fullPath}: ${err}`);
          }
        });
      });
  
      res.status(200).json("News has been deleted");
    } catch (error) {
      next(error);
    }
  };

  export const updateNews = [
    upload.array('images'),
    async (req, res, next) => {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to update this news'));
      }
      if (!req.body.title || !req.body.slug || !req.body.content) {
        return next(errorHandler(400, 'Please provide all the fields'));
      }
  
      try {
        const news = await News.findById(req.params.newsId);
        if (!news) {
          return next(errorHandler(404, 'News not found'));
        }
  
        const newImagePaths = req.files.map((file) => file.path);
        const imageUrls = JSON.parse(req.body.imageUrls); 
        const existingImages = news.images;
  
  
        const updatedImages = [...imageUrls, ...newImagePaths];
  
        news.title = req.body.title;
        news.author = req.body.author;
        news.slug = req.body.slug;
        news.content = req.body.content;
        news.images = updatedImages;
  
  
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
  
        const updatedNews = await news.save();
        res.status(200).json(updatedNews);
      } catch (error) {
        next(error);
      }
    },
  ];
