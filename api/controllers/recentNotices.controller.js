import fs from "fs";
import multer from "multer";
import path from "path";
import { errorHandler } from "../utlis/error.js";
import RecentNotice from "../models/recentNotices.models.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "api/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const addNewNotice = [
  upload.array("images"),
  async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to add notice"));
    }
    if (!req.body.title || !req.body.slug || !req.body.content) {
      return next(errorHandler(400, "Please provide all the fields"));
    }

    const imagePaths = req.files.map((file) => file.path);

    const newNotice = new RecentNotice({
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      images: imagePaths,
    });

    try {
      const savedNotice = await newNotice.save();
      res.status(201).json(savedNotice);
    } catch (error) {
      next(error);
    }
  },
];

export const getNotices = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const notices = await RecentNotice.find({
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.noticeId && { _id: req.query.noticeId }),
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

    const totatlNotices = await RecentNotice.countDocuments();
    res.status(200).json({
      notices,
      totatlNotices,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotice = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this notice"));
  }

  try {
    const notice = await RecentNotice.findById(req.params.noticeId);
    if (!notice) {
      return next(errorHandler(404, "Notice not found"));
    }

    const images = notice.images;

    await RecentNotice.findByIdAndDelete(req.params.noticeId);

    images.forEach((imagePath) => {
      const fullPath = path.resolve(imagePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete image at ${fullPath}: ${err}`);
        }
      });
    });

    res.status(200).json("Notice and its images have been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateNotice = [
  upload.array('images'),
  async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to update this notice'));
    }
    if (!req.body.title || !req.body.slug || !req.body.content) {
      return next(errorHandler(400, 'Please provide all the fields'));
    }

    try {
      const notice = await RecentNotice.findById(req.params.noticeId);
      if (!notice) {
        return next(errorHandler(404, 'Notice not found'));
      }

      const newImagePaths = req.files.map((file) => file.path);
      const imageUrls = JSON.parse(req.body.imageUrls); 
      const existingImages = notice.images;


      const updatedImages = [...imageUrls, ...newImagePaths];

      notice.title = req.body.title;
      notice.slug = req.body.slug;
      notice.content = req.body.content;
      notice.images = updatedImages;


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

      const updatedNotice = await notice.save();
      res.status(200).json(updatedNotice);
    } catch (error) {
      next(error);
    }
  },
];