const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReviews,isloggedin, isReviewAuther} = require("../middleware.js")
const reviewController = require("../controllers/review.js");




//post review route

router.post(
  "/",
  isloggedin,
  validateReviews,
  wrapAsync(reviewController.postReview)
);

// delete review route
router.delete(
  "/:reviewId",
  isloggedin,
  isReviewAuther,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
