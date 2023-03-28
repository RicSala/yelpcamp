import express from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedin, isReviewAuthor, validateReview } from "../middleware.js";
import { deleteReview, submitNewReview } from "../controllers/reviews.js";

const router = express.Router({ mergeParams: true })

router.post('/', isLoggedin, validateReview, catchAsync(submitNewReview))

router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchAsync(deleteReview))

export default router