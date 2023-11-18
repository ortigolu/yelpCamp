const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isReviewAuthor, isLoggedIn } = require("../middleware");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
