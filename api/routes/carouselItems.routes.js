import express from 'express';
import { verifyAdmin } from "../utlis/verifyAdmin.js";
import { addNewCarousel, deleteCarousels, getCarousels, updateCarousel } from '../controllers/carouselItems.controller.js';

const router = express.Router();

router.post("/addnewcarousel", verifyAdmin, addNewCarousel);
router.get("/getcarousels", getCarousels);
router.delete("/deletecarousel/:carouselId/:userId", verifyAdmin, deleteCarousels);
router.put("/updatecarousel/:carouselId/:userId", verifyAdmin, updateCarousel);

export default router;