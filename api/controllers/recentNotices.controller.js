import fs from "fs";
import multer from "multer";
import path from "path";
import { errorHandler } from "../utlis/error.js";
import RecentNotice from "../models/recentNotices.models.js";

const uploadPath = "api/uploads/notice";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.access(uploadPath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
          if (err) {
            return cb(err);
          }
          cb(null, uploadPath);
        });
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);

    cb(null, `${timestamp}-${nameWithoutExt}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Only images and PDFs are allowed!");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export const addNewNotice = [
  upload.fields([{ name: "images" }, { name: "pdfs" }]),
  async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to add notice"));
    }
    if (!req.body.title || !req.body.slug || !req.body.content) {
      return next(errorHandler(400, "Please provide all the fields"));
    }

    const imagePaths = req.files["images"]
      ? req.files["images"].map((file) => file.path)
      : [];
    const pdfPaths = req.files["pdfs"]
      ? req.files["pdfs"].map((file) => file.path)
      : [];

    const newNotice = new RecentNotice({
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      images: imagePaths,
      pdfs: pdfPaths,
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
    const pdfs = notice.pdfs;

    await RecentNotice.findByIdAndDelete(req.params.noticeId);

    images.forEach((imagePath) => {
      const fullPath = path.resolve(imagePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete image at ${fullPath}: ${err}`);
        }
      });
    });

    pdfs.forEach((pdfPath) => {
      const fullPath = path.resolve(pdfPath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete PDF at ${fullPath}: ${err}`);
        }
      });
    });

    res.status(200).json("Notice, its images, and PDFs have been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateNotice = [
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "pdfs", maxCount: 10 },
  ]),
  async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to update this notice")
      );
    }
    if (!req.body.title || !req.body.slug || !req.body.content) {
      return next(errorHandler(400, "Please provide all the fields"));
    }

    try {
      const notice = await RecentNotice.findById(req.params.noticeId);
      if (!notice) {
        return next(errorHandler(404, "Notice not found"));
      }

      const newImagePaths = req.files["images"]
        ? req.files["images"].map((file) => file.path)
        : [];
      const newPdfPaths = req.files["pdfs"]
        ? req.files["pdfs"].map((file) => file.path)
        : [];

      const imageUrls = JSON.parse(req.body.imageUrls);
      const pdfUrls = JSON.parse(req.body.pdfUrls);

      const existingImages = notice.images;
      const existingPdfs = notice.pdfs;

      const updatedImages = [...imageUrls, ...newImagePaths];
      const updatedPdfs = [...pdfUrls, ...newPdfPaths];

      notice.title = req.body.title;
      notice.slug = req.body.slug;
      notice.content = req.body.content;
      notice.images = updatedImages;
      notice.pdfs = updatedPdfs;

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

      const pdfsToDelete = existingPdfs.filter(
        (pdfPath) => !pdfUrls.includes(pdfPath)
      );
      pdfsToDelete.forEach((pdfPath) => {
        const fullPath = path.resolve(pdfPath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete PDF at ${fullPath}: ${err}`);
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
