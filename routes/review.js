const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const {
  isLoggedIn,
  validateReivew,
  isReviewAuthore,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//post review route
router.post(
  "/",
  isLoggedIn,
  validateReivew,
  wrapAsync(reviewController.createReview),
);

//review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthore, wrapAsync(reviewController.deleteReview));

module.exports = router;