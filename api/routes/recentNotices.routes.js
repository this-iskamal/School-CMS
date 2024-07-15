import express from "express";
import { verifyAdmin } from "../utlis/verifyAdmin.js";
import {
  addNewNotice,
  deleteNotice,
  getNotices,
  updateNotice,
} from "../controllers/recentNotices.controller.js";

const router = express.Router();

router.post("/addnewnotice", verifyAdmin, addNewNotice);
router.get("/getnotices", getNotices);
router.delete("/deletenotice/:noticeId/:userId", verifyAdmin, deleteNotice);
router.put("/updatenotice/:noticeId/:userId", verifyAdmin, updateNotice);

export default router;
