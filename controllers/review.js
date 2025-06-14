const Review = require("../models/review.js");
const List = require("../models/listing.js");

const postReview = async (req, res) => {
    let { id } = req.params;
    let {review} = req.body;
    let listing = await List.findById(id);
    let newReview = new Review(review);
    newReview.author = req.user._id;
    listing.reviewList.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new review created");
    res.redirect(`/listings/${listing._id}`);
  }

  const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await List.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted ");
    res.redirect(`/listings/${id}`);
  }


  module.exports = {
    postReview,
    deleteReview

  }