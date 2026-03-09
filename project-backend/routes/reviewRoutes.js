import express from "express";
import { createReview, getReviewsForUser,getReviewById,deleteReview } from "../controllers/reviewController.js";

const router = express.Router();
router.post("/", createReview);
router.get("/user/user:Id",getReviewById);
router.get("/user/:userId", getReviewsForUser);
router.delete("/:reviewId", deleteReview);

export default router;