import fs from "fs";
import multer from "multer";
import path from "path";
import { errorHandler } from "../utlis/error.js";
import Teacher from "../models/teachers.models.js";

const uploadPath = 'api/uploads/teacher';

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
    if (!req.body.name || !req.body.address || !req.body.position || !req.body.phonenumber) {
      return next(errorHandler(400, "Please provide all the fields"));
    }

    const newTeacher = new Teacher({
      name: req.body.name,
      address: req.body.address,
      position: req.body.position,
      profilePicture: req.file.path,
      phonenumber:req.body.phonenumber,
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

    const totalTeachers = await Teacher.countDocuments();
    res.status(200).json({ teachers, totalTeachers });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
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

export const updateTeacher = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update teacher"));
  }
  if (!req.body.name || !req.body.address || !req.body.position ||!req.body.phonenumber) {
    return next(errorHandler(400, "Please provide all the fields"));
  }

  try {
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
      return next(errorHandler(404, "Teacher not found"));
    }

    teacher.name = req.body.name;
    teacher.address = req.body.address;
    teacher.position = req.body.position;
    teacher.phonenumber = req.body.phonenumber;

    const updatedTeacher = await teacher.save();
    res.status(200).json(updatedTeacher);
  } catch (error) {
    next(error);
  }
};
