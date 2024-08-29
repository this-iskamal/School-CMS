import express from 'express';
import { verifyAdmin } from "../utlis/verifyAdmin.js";
import { addNewTeacher, deleteTeacher, getTeachers, updateTeacher } from '../controllers/teacher.controller.js';

const router = express.Router();

router.post("/addnewteacher", verifyAdmin, addNewTeacher);
router.get("/getteachers", getTeachers);
router.delete("/deleteteacher/:teacherId/:userId", verifyAdmin, deleteTeacher);
router.put("/updateteacher/:teacherId/:userId", verifyAdmin, updateTeacher);

export default router;