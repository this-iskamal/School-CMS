import express from 'express';
import { verifyAdmin } from "../utlis/verifyAdmin.js";
import { addNewGallery, deleteGallery, getGallery, updateGallery } from '../controllers/gallery.controller.js';

const router = express.Router();

router.post("/addnewgallery", verifyAdmin, addNewGallery);
router.get("/getgallery", getGallery);
router.delete("/deletegallery/:galleryId/:userId", verifyAdmin, deleteGallery);
router.put("/updategallery/:galleryId/:userId", verifyAdmin, updateGallery);

export default router;