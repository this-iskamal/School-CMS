import express from 'express';
import { verifyAdmin } from '../utlis/verifyAdmin.js';
import { addNewNews, deletenews, getNews, updateNews } from '../controllers/news.controller.js';

const router = express.Router();

router.post("/addnewnews", verifyAdmin, addNewNews);
router.get("/getnews", getNews);
router.delete("/deletenewd/:newsid/:userId", verifyAdmin, deletenews);
router.put("/updatenews/:newsid/:userId", verifyAdmin, updateNews);


export default router;