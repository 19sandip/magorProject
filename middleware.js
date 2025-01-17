const List = require("./models/listing");
const Review = require("./models/review");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


const isloggedin= (req, res, next) =>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
        req.flash("error", "first login!");
      return  res.redirect("/user/login");
      }
      next();
}

const saveredirectUrl = (req, res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const  isOwner = async (req, res, next) =>{
  let { id } = req.params;
    let listing = await List.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the owner of this listing!")
      return res.redirect(`/listings/${id}`);
    }
    next();
}

const validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body.listing);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


const validateReviews = (req, res, next) => {
  console.log("reviewing input ...");
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const  isReviewAuther = async (req, res, next) =>{
  let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "You are not autherize to delete it!")
      return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports = {
  isloggedin,
  saveredirectUrl,
  isOwner,
  isReviewAuther,
  validateListings,
  validateReviews 
}