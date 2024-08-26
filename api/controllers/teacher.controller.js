import fs from "fs";
import multer from "multer";
import path from "path";
import { errorHandler } from "../utlis/error.js";
import Teacher from "../models/teacher.models.js";
import { error } from "console";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "api/uploads/teacher");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const addNewTeacher = [
  upload.single("profilePicture"),
  async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to add teacher"));
    }
    if (
      !req.body.name ||
      !req.body.address ||
      !req.body.position ||
      !req.body.teachingSubjects
    ) {
      return next(errorHandler(400, "Please provide all the fields"));
    }

    const newTeacher = new Teacher({
      name: req.body.name,
      address: req.body.address,
      position: req.body.position,
      profilePicture: req.file.path,
      teachingSubjects: JSON.parse(req.body.teachingSubjects),
    });

    try {
      const savedTeacher = await newTeacher.save();
      res.status(201).json(savedTeacher);
    } catch (error) {
      next(error);
    }
  },
];

export const getTeachers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const teachers = await Teacher.find({
      ...(req.query.teacherId && { _id: req.query.teacherId }),
      ...(req.query.searchTerm && {
        $or: [
          { name: { $regex: req.query.searchTerm, $options: "i" } },
          { position: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortDirection });
    res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.teacherId) {
    return next(errorHandler(403, "You are not allowed to delete teacher"));
  }

  try {
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
      return next(errorHandler(404, "Teacher not found"));
    }

    const image = teacher.profilePicture;

    await Teacher.findByIdAndDelete(req.params.teacherId);

    const fullPath = path.resolve(image);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete image at  ${fullPath}: ${err}`);
      }
    });

    res.status(200).json("Teacher has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = [
  upload.single("profilePicture"),
  async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to update teacher"));
    }
    if (
      !req.body.name ||
      !req.body.address ||
      !req.body.position ||
      !req.body.teachingSubjects
    ) {
      return next(errorHandler(400, "Please provide all the fields"));
    }

    try {
      const teacher = await Teacher.findById(req.params.teacherId);
      if (!teacher) {
        return next(errorHandler(404, "Teacher not found"));
      }

      const newImagePath = req.file.path;
      const imageUrl = JSON.parse(req.body.imageUrl);
      const existingImage = Teacher.profilePicture;

      const updatedImage = [...imageUrl, ...newImagePath];

      teacher.name = req.body.name;
      teacher.address = req.body.address;
      teacher.position = req.body.position;
      teacher.profilePicture = updatedImage;
      teacher.teachingSubjects = JSON.parse(req.body.teachingSubjects);

      const imagesToDelete = existingImage.filter(
        (imagePath) => !imageUrl.includes(imagePath)
      );
      imagesToDelete.forEach((imagePath) => {
        const fullPath = path.resolve(imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete image at ${fullPath}: ${err}`);
          }
        });
      });

      const updatedTeacher = await teacher.save();
      res.status(200).json(updatedTeacher);
    } catch (error) {
      next(error);
    }
  },
];
