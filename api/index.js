import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import carouselItemsRoute from "./routes/carouselItems.routes.js";
import galleryRoute from "./routes/gallery.routes.js";
import newsRoute from "./routes/news.routes.js";
import recentNoticesRoute from "./routes/recentNotices.routes.js";
import teachersRoute from "./routes/teachers.routes.js";
import authRoute from "./routes/auth.routes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/auth", authRoute);
app.use("/api/carouselitems", carouselItemsRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/news", newsRoute);
app.use("/api/recentnotices", recentNoticesRoute);
app.use("/api/teachers", teachersRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
